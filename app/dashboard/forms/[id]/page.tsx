"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { getProcessById, getUsers, createTask } from "@/lib/api-service"

interface Field {
  id: number
  name: string
  field_type: string
  order: number
  required: boolean
  options: string[] | null
}

interface Process {
  id: number
  name: string
  description: string
  fields: Field[]
}

interface User {
  id: number
  username: string
  first_name?: string
  last_name?: string
  department?: {
    id: number
    name: string
  }
  role?: {
    id: number
    name: string
  }
}

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params)

  const router = useRouter()
  const [process, setProcess] = useState<Process | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [title, setTitle] = useState("")
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch process and users in parallel
        const [processResponse, usersResponse] = await Promise.all([getProcessById(id), getUsers()])

        // Sort fields by order
        const processData = processResponse.data
        if (processData.fields) {
          processData.fields.sort((a: Field, b: Field) => a.order - b.order)
        }

        setProcess(processData)
        setUsers(usersResponse.data.results || [])
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.error || "Failed to load form data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleInputChange = (fieldId: number, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    })
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const missingFields = process?.fields
      .filter((field) => field.required && !formValues[field.id])
      .map((field) => field.name)

    if (missingFields && missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      return
    }

    if (!title) {
      alert("Please enter a task title")
      return
    }

    setShowReview(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Find assignee field if it exists
      const assigneeField = process?.fields.find((field) => field.field_type === "assignee")

      // Format the data for the API
      const taskData = {
        process: process?.id,
        title: title,
        // If we have an assignee field, use its value
        ...(assigneeField && formValues[assigneeField.id] && { assignee: formValues[assigneeField.id] }),
        fields: Object.entries(formValues)
          // Filter out assignee fields as they're handled separately
          .filter(([key, _]) => {
            const fieldId = Number.parseInt(key)
            const field = process?.fields.find((f) => f.id === fieldId)
            return field && field.field_type !== "assignee"
          })
          .map(([key, value]) => ({
            field_id: key,
            value: value,
          })),
      }

      // Submit the task
      const response = await createTask(taskData)

      alert("Task created successfully!")
      router.push("/dashboard/sent")
    } catch (err: any) {
      console.error("Error creating task:", err)
      alert(err.response?.data?.error || "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: Field) => {
    switch (field.field_type) {
      case "assignee":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            disabled={showReview}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.username} {user.department ? `(${user.department.name})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "text":
        return (
          <Input
            id={`field-${field.id}`}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )
      case "number":
        return (
          <Input
            id={`field-${field.id}`}
            type="number"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )
      case "date":
        return (
          <Input
            id={`field-${field.id}`}
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={`field-${field.id}`}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )
      case "select":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            disabled={showReview}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`field-${field.id}`}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              disabled={showReview}
            />
            <label
              htmlFor={`field-${field.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Yes
            </label>
          </div>
        )
      case "file":
        return (
          <Input
            id={`field-${field.id}`}
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0]?.name || "")}
            required={field.required}
            disabled={showReview}
          />
        )
      default:
        return null
    }
  }

  // Helper function to display field value in review mode
  const displayFieldValue = (field: Field) => {
    if (!formValues[field.id]) {
      return <span className="text-muted-foreground italic">No value provided</span>
    }

    switch (field.field_type) {
      case "assignee":
        return users.find((u) => u.id.toString() === formValues[field.id])?.username || formValues[field.id]
      case "checkbox":
        return formValues[field.id] ? "Yes" : "No"
      default:
        return formValues[field.id]
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading form template...</p>
      </div>
    )
  }

  if (error || !process) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Template not found</h3>
        <p className="text-muted-foreground mt-2">{error || "The requested form template does not exist."}</p>
        <Link href="/dashboard/forms">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </Link>
      </div>
    )
  }

  // Sort fields by order
  const sortedFields = [...process.fields].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{process.name}</h1>
        </div>
      </div>

      {showReview ? (
        <Card>
          <CardHeader>
            <CardTitle>Review Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Task Title</Label>
              <div className="p-3 bg-muted rounded-md">{title}</div>
            </div>

            {sortedFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="p-3 bg-muted rounded-md">{displayFieldValue(field)}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowReview(false)} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Task
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>
          <form onSubmit={handleReview}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this task"
                  required
                />
              </div>

              {sortedFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={`field-${field.id}`}>
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                <Button type="submit">
                  <Eye className="mr-2 h-4 w-4" />
                  Review
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
