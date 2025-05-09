"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search } from "lucide-react"

// Mock data for form templates
const formTemplates = [
  { id: 1, title: "Project Update", description: "Weekly project status update form", fields: 8 },
  { id: 2, title: "Expense Report", description: "Submit your expenses for reimbursement", fields: 12 },
  { id: 3, title: "Leave Request", description: "Request time off or vacation days", fields: 6 },
  { id: 4, title: "Bug Report", description: "Report issues or bugs in the system", fields: 10 },
  { id: 5, title: "Client Feedback", description: "Collect feedback from clients", fields: 15 },
  { id: 6, title: "Performance Review", description: "Employee performance evaluation form", fields: 20 },
]

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = formTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Templates</h1>
          <p className="text-muted-foreground mt-2">Browse and select from available task templates</p>
        </div>
        <Link href="/dashboard/forms/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Form
          </Button>
        </Link>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                {template.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <p className="text-sm mt-2">{template.fields} fields</p>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-3">
              <Link href={`/dashboard/forms/${template.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or create a new form template.</p>
        </div>
      )}
    </div>
  )
}
