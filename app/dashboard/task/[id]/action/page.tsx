"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { getTaskById, performTaskAction } from "@/lib/api-service"

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
  task_data: Array<{
    field: {
      id: number
      name: string
    }
    value: string
  }>
  available_actions?: Array<{
    id: number
    name: string
    description: string
  }>
}

export default function TaskActionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTaskData() {
      setIsLoading(true)
      try {
        const response = await getTaskById(params.id)
        const taskData = response.data

        if (taskData && taskData.available_actions && taskData.available_actions.length > 0) {
          setTask(taskData)
          // Set the first available action as the default selected action
          setSelectedAction(taskData.available_actions[0].name)
        } else {
          setError("Task not found or no action available")
        }
      } catch (err: any) {
        console.error("Error fetching task:", err)
        setError(err.response?.data?.error || "Failed to load task details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaskData()
  }, [params.id])

  const handleAction = async () => {
    if (!task || !selectedAction) return

    setIsSubmitting(true)
    try {
      await performTaskAction(task.id, {
        action: selectedAction.toLowerCase(),
        comment: comment,
      })

      alert(`Action "${selectedAction}" performed successfully!`)
      router.push("/dashboard/received")
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || "Failed to perform action")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading task action...</p>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Action not available</h3>
        <p className="text-muted-foreground mt-2">{error || "No action is available for this task."}</p>
        <Link href="/dashboard/received">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Received Tasks
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
          <h1 className="text-2xl font-bold tracking-tight">{selectedAction} Task</h1>
          <p className="text-muted-foreground">{task.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.task_data &&
            task.task_data.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{field.field.name}</label>
                <div className="p-3 bg-muted rounded-md">
                  {field.value || <span className="text-muted-foreground italic">No response provided</span>}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedAction} Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment about your decision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
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
                {selectedAction}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
