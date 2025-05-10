"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  options?: string[]
}

interface FormTemplate {
  id: number
  title: string
  description: string
  fields: FormField[]
}

export default function FormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [assignee, setAssignee] = useState("")

  useEffect(() => {
    const fetchFormTemplate = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get("/api/forms")
        const templates = response.data.formTemplates

        if (templates[params.id]) {
          setFormTemplate(templates[params.id])
        } else {
          setError("Form template not found")
        }
      } catch (err: any) {
        console.error("Failed to fetch form template:", err)
        setError(err.response?.data?.error || "Failed to load form template")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormTemplate()
  }, [params.id])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!assignee) {
      alert("Please select an assignee")
      return
    }

    try {
      if (!formTemplate) {
        throw new Error("Form template is not loaded");
      }
      const response = await axios.post("/api/tasks/submit", {
        processId: formTemplate.id,
        assignee,
        formValues,
      })

      if (response.data.success) {
        alert("Task created successfully!")
        router.push("/dashboard/sent")
      } else {
        alert(response.data.error || "Failed to create task")
      }
    } catch (err: any) {
      console.error("Failed to submit task:", err)
      alert(err.response?.data?.error || "Failed to create task")
    }
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        )
      case "select":
        return (
          <Select value={formValues[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
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
              id={field.id}
              checked={formValues[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Yes
            </label>
          </div>
        )
      default:
        return null
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

  if (error || !formTemplate) {
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
          <h1 className="text-2xl font-bold tracking-tight">{formTemplate.title}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john.doe">John Doe</SelectItem>
                  <SelectItem value="jane.smith">Jane Smith</SelectItem>
                  <SelectItem value="alex.johnson">Alex Johnson</SelectItem>
                  <SelectItem value="sarah.williams">Sarah Williams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formTemplate.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button variant="outline" type="button">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Send Task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
