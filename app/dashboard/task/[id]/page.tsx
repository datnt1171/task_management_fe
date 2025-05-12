"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle, Download, User, Loader2, Clock } from "lucide-react"
import { getTaskById, performTaskAction } from "@/lib/api-service"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface TaskData {
  field: {
    id: number
    name: string
  }
  value: string
}

interface ActionLog {
  id: number
  user: {
    id: number
    username: string
  }
  action: {
    id: number
    name: string
    description: string
  }
  comment?: string
  timestamp: string
}

interface Task {
  id: number
  title: string
  process: {
    id: number
    name: string
  }
  state: {
    id: number
    name: string
  }
  created_by: {
    id: number
    username: string
  }
  created_at: string
  stakeholders: Array<{
    id: number
    user: {
      id: number
      username: string
    }
  }>
  task_data: TaskData[]
  action_logs: ActionLog[]
  available_actions?: Array<{
    id: number
    name: string
    description: string
  }>
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ id: number; name: string; description: string } | null>(null)
  const [actionComment, setActionComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTaskData()
  }, [params.id])

  const fetchTaskData = async () => {
    setIsLoading(true)
    try {
      const response = await getTaskById(params.id)
      setTask(response.data)
    } catch (err: any) {
      console.error("Error fetching task:", err)
      setError(err.response?.data?.error || "Failed to load task details")
    } finally {
      setIsLoading(false)
    }
  }

  const openActionDialog = (action: { id: number; name: string; description: string }) => {
    setSelectedAction(action)
    setActionComment("")
    setActionDialogOpen(true)
  }

  const handleAction = async () => {
    if (!task || !selectedAction) return

    setIsSubmitting(true)
    try {
      const response = await performTaskAction(task.id, {
        action: selectedAction.name.toLowerCase(),
        comment: actionComment,
      })

      setTask(response.data.task)
      setActionDialogOpen(false)
      alert(`Task ${selectedAction.name.toLowerCase()}d successfully!`)
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || "Failed to perform action")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "working-on":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "approved":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading task details...</p>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Task not found</h3>
        <p className="text-muted-foreground mt-2">{error || "The requested task does not exist."}</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">{task.process.name}</Badge>
            <Badge variant="outline" className={getStatusColor(task.state.name)}>
              {task.state.name}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {task.task_data.map((data) => (
                <div key={data.field.id} className="space-y-2">
                  <label className="text-sm font-medium">{data.field.name}</label>
                  <div className="p-3 bg-muted rounded-md">
                    {data.value || <span className="text-muted-foreground italic">No response provided</span>}
                  </div>
                </div>
              ))}

              {(!task.task_data || task.task_data.length === 0) && (
                <div className="p-3 bg-muted rounded-md text-center">
                  <span className="text-muted-foreground italic">No field data available</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.action_logs.map((log) => (
                  <div key={log.id} className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{log.user.username}</span>{" "}
                        <span className="text-muted-foreground">{log.action.description || log.action.name}</span>
                      </p>
                      {log.comment && <p className="text-sm mt-1 italic">"{log.comment}"</p>}
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created On</p>
                  <p className="text-sm text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {task.created_by && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-sm text-muted-foreground">{task.created_by.username}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Stakeholders</p>
                  <p className="text-sm text-muted-foreground">
                    {task.stakeholders.map((s) => s.user.username).join(", ")}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {task.available_actions && task.available_actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {task.available_actions.map((action) => (
                  <Button
                    key={action.id}
                    className="w-full justify-start mb-2"
                    onClick={() => openActionDialog(action)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {action.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAction?.name} Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment (Optional)</label>
              <Textarea
                placeholder="Add a comment about your decision..."
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {selectedAction?.name}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
