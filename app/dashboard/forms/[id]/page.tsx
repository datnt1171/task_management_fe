"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"

// Mock form templates data
const formTemplates = {
  "1": {
    id: 1,
    title: "Project Update",
    description: "Weekly project status update form",
    fields: [
      { id: "title", label: "Project Title", type: "text", required: true },
      {
        id: "status",
        label: "Project Status",
        type: "select",
        options: ["On Track", "At Risk", "Delayed", "Completed"],
        required: true,
      },
      { id: "progress", label: "Progress (0-100%)", type: "number", required: true },
      { id: "achievements", label: "Key Achievements", type: "textarea", required: true },
      { id: "challenges", label: "Challenges Faced", type: "textarea", required: false },
      { id: "next_steps", label: "Next Steps", type: "textarea", required: true },
      { id: "support", label: "Support Needed", type: "textarea", required: false },
      { id: "attachments", label: "Include Attachments", type: "checkbox", required: false },
    ],
  },
  "2": {
    id: 2,
    title: "Expense Report",
    description: "Submit your expenses for reimbursement",
    fields: [
      { id: "date", label: "Date of Expense", type: "date", required: true },
      {
        id: "category",
        label: "Expense Category",
        type: "select",
        options: ["Travel", "Meals", "Office Supplies", "Software", "Other"],
        required: true,
      },
      { id: "amount", label: "Amount", type: "number", required: true },
      { id: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "GBP", "JPY"], required: true },
      { id: "description", label: "Description", type: "textarea", required: true },
      { id: "receipt", label: "Receipt Attached", type: "checkbox", required: true },
    ],
  },
}

export default function FormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const formTemplate = formTemplates[params.id as keyof typeof formTemplates]

  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [assignee, setAssignee] = useState("")

  if (!formTemplate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Template not found</h3>
        <p className="text-muted-foreground mt-2">The requested form template does not exist.</p>
        <Link href="/dashboard/forms">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </Link>
      </div>
    )
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Form values:", formValues)
    console.log("Assigned to:", assignee)

    // Simulate saving the task
    alert("Task created successfully!")
    router.push("/dashboard/sent")
  }

  const renderField = (field: any) => {
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
              {field.options.map((option: string) => (
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
