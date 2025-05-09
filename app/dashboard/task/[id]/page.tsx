"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, CheckCircle, Clock, Download, MessageCircle, Send, User } from "lucide-react"

// Mock task data
const tasks = {
  // Sent task
  "1": {
    id: 1,
    title: "Weekly Project Update",
    type: "sent",
    formType: "Project Update",
    status: "Completed",
    date: "2023-05-08",
    dueDate: "2023-05-10",
    completedDate: "2023-05-09",
    recipient: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    fields: [
      { label: "Project Title", value: "Website Redesign" },
      { label: "Project Status", value: "On Track" },
      { label: "Progress", value: "75%" },
      {
        label: "Key Achievements",
        value:
          "Completed homepage design and navigation structure. Implemented responsive layouts for all device sizes.",
      },
      { label: "Challenges Faced", value: "Integration with legacy systems is taking longer than expected." },
      { label: "Next Steps", value: "Begin implementation of user authentication system and profile pages." },
      { label: "Support Needed", value: "Need additional resources for testing across multiple browsers." },
    ],
    comments: [
      {
        author: "John Doe",
        date: "2023-05-09",
        text: "All tasks completed as requested. Let me know if you need any clarification.",
      },
      { author: "You", date: "2023-05-09", text: "Thanks for the update. Everything looks good!" },
    ],
  },
  // Received task
  "101": {
    id: 101,
    title: "Monthly Team Report",
    type: "received",
    formType: "Team Report",
    status: "Pending",
    date: "2023-05-08",
    dueDate: "2023-05-15",
    sender: {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
    },
    fields: [
      { label: "Team Name", value: "" },
      { label: "Reporting Period", value: "May 2023" },
      { label: "Key Accomplishments", value: "" },
      { label: "Challenges", value: "" },
      { label: "Resource Needs", value: "" },
      { label: "Goals for Next Month", value: "" },
    ],
    comments: [
      {
        author: "Sarah Williams",
        date: "2023-05-08",
        text: "Please complete this report by the 15th. Include all team activities for May.",
      },
    ],
  },
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const taskId = params.id
  const task = tasks[taskId as keyof typeof tasks]

  const [comment, setComment] = useState("")
  const [taskFields, setTaskFields] = useState(task?.fields || [])

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Task not found</h3>
        <p className="text-muted-foreground mt-2">The requested task does not exist.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const isReceived = task.type === "received"
  const isPending = task.status === "Pending" || task.status === "In Progress"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...taskFields]
    updatedFields[index] = { ...updatedFields[index], value }
    setTaskFields(updatedFields)
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    // In a real app, you would send this to your backend
    console.log("New comment:", comment)

    // Simulate adding a comment
    alert("Comment added successfully!")
    setComment("")
  }

  const handleSubmitTask = () => {
    // In a real app, you would send this to your backend
    console.log("Task submission:", taskFields)

    // Simulate submitting the task
    alert("Task submitted successfully!")
    router.push("/dashboard/received")
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
            <Badge variant="outline">{task.formType}</Badge>
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status}
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
              {taskFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  {isReceived && isPending ? (
                    <Textarea
                      value={field.value || ""}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      rows={field.label.includes("Achievements") || field.label.includes("Challenges") ? 4 : 2}
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      {field.value || <span className="text-muted-foreground italic">No response provided</span>}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            {isReceived && isPending && (
              <CardFooter>
                <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                  Save Draft
                </Button>
                <Button onClick={handleSubmitTask}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Response
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.comments.map((comment, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{comment.author}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleSubmitComment} size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Send Comment
                </Button>
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
                  <p className="text-sm text-muted-foreground">{new Date(task.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {task.completedDate && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Completed On</p>
                    <p className="text-sm text-muted-foreground">{new Date(task.completedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{isReceived ? "From" : "To"}</p>
                  <p className="text-sm text-muted-foreground">{isReceived ? task.sender.name : task.recipient.name}</p>
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

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isReceived ? (
                <>
                  {isPending && (
                    <Button className="w-full justify-start" variant="outline" onClick={handleSubmitTask}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </Button>
                  )}
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Request Clarification
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start" variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Recipient
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
