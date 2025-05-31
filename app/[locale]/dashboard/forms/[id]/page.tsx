"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectItem } from "@/components/ui/select"
import { Assignee, AssigneeTrigger, AssigneeValue, AssigneeContent, AssigneeItem } from "@/components/ui/assignee"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Loader2, Eye } from "lucide-react"
import { Link } from "@/i18n/navigation"
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
}

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [process, setProcess] = useState<Process | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch process and users in parallel
        const [processResponse, usersResponse] = await Promise.all([getProcessById(id), getUsers()])
        const processData = processResponse.data

        setProcess(processData)
        setUsers(usersResponse.data || []) // Correctly set the users state
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

    setShowReview(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Format the data for the API
      const taskData = {
        process: process?.id,
        fields: Object.entries(formValues).map(([key, value]) => ({
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
      case "assignee": {
        return (
          <Assignee
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            disabled={showReview}
          >
            <AssigneeTrigger>
              {/* Add formatDisplay to convert ID to username */}
              <AssigneeValue 
                placeholder="Select a user"
                formatDisplay={(value) => {
                  const user = users.find(u => u.id.toString() === value);
                  return user 
                    ? `${user.first_name} ${user.last_name} (${user.username})` 
                    : value;
                }}
              />
            </AssigneeTrigger>
            <AssigneeContent>
              {users.map((user) => (
                <AssigneeItem key={user.id} value={user.id.toString()}>
                  {user.first_name} {user.last_name} ({user.username})
                </AssigneeItem>
              ))}
            </AssigneeContent>
          </Assignee>
        );
      }
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
            {(field.options || []).map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
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

            {/* Use process.fields directly */}
            {process.fields.map((field) => (
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

              {/* Use process.fields directly */}
              {process.fields.map((field) => (
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
