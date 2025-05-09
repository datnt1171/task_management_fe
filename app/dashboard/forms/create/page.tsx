"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Save, Trash } from "lucide-react"
import Link from "next/link"

type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "date"

interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
}

export default function CreateFormPage() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([{ id: "field_1", label: "", type: "text", required: false }])

  const addField = () => {
    const newId = `field_${fields.length + 1}`
    setFields([...fields, { id: newId, label: "", type: "text", required: false }])
  }

  const removeField = (index: number) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }

  const updateField = (index: number, field: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    setFields(newFields)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Form template:", {
      title: formTitle,
      description: formDescription,
      fields,
    })

    // Simulate saving the form template
    alert("Form template created successfully!")
    router.push("/dashboard/forms")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/forms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create Form Template</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
              />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Form Fields</h3>

              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Field {index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeField(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${field.id}-label`}>Field Label</Label>
                      <Input
                        id={`${field.id}-label`}
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="Enter field label"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(index, { type: value as FieldType })}
                      >
                        <SelectTrigger id={`${field.id}-type`}>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {field.type === "select" && (
                      <div className="space-y-2">
                        <Label htmlFor={`${field.id}-options`}>Options (comma separated)</Label>
                        <Input
                          id={`${field.id}-options`}
                          value={field.options?.join(", ") || ""}
                          onChange={(e) =>
                            updateField(index, {
                              options: e.target.value
                                .split(",")
                                .map((opt) => opt.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${field.id}-required`}
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`${field.id}-required`}>Required field</Label>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addField} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button variant="outline" type="button">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button type="submit">Create Template</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
