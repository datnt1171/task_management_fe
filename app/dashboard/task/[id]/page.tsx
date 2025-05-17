"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Loader2, Clock } from "lucide-react"
import { getTaskById, performTaskAction } from "@/lib/api-service"
import { getStatusColor } from "@/lib/utils"

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
    type: string
  }
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
    state_type: string
  }
  created_by: {
    id: number
    username: string
  }
  created_at: string
  task_data: TaskData[]
  action_logs: ActionLog[]
  available_actions: Array<{
    id: number
    name: string
    description: string
    type: string
  }>
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = use(params)
  useEffect(() => {
    fetchTaskData()
  }, [id])

  const fetchTaskData = async () => {
    setIsLoading(true)
    try {
      const response = await getTaskById(id)
      setTask(response.data)
    } catch (err: any) {
      console.error("Error fetching task:", err)
      setError(err.response?.data?.error || "Failed to load task details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = async (actionId: number) => {
    if (!task) return
    try {
      await performTaskAction(task.id, { action_id: actionId })
      alert(`Action performed successfully!`)
      fetchTaskData() // Refresh task data after action
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || "Failed to perform action")
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
            <Badge variant="outline" className={getStatusColor(task.state.state_type)}>
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
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {(!task.action_logs || task.action_logs.length === 0) && (
                  <div className="text-center text-muted-foreground">
                    <p>No activity recorded yet</p>
                  </div>
                )}
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

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">{task.created_by.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {task.available_actions.length > 0 ? (
                task.available_actions.map((action) => (
                  <Button
                    key={action.id}
                    className="w-full justify-start mb-2"
                    variant="outline"
                    onClick={() => handleActionClick(action.id)}
                  >
                    {action.name}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No actions available for this task.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
