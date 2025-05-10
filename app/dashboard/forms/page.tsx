"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Loader2 } from "lucide-react"
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

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formTemplates, setFormTemplates] = useState<Record<string, FormTemplate>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormTemplates = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get("/api/forms")
        setFormTemplates(response.data.formTemplates)
      } catch (err: any) {
        console.error("Failed to fetch form templates:", err)
        setError(err.response?.data?.error || "Failed to load form templates")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormTemplates()
  }, [])

  const filteredTemplates = Object.values(formTemplates).filter(
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading form templates...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-destructive">Error loading templates</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : (
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
                <p className="text-sm mt-2">{template.fields.length} fields</p>
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
      )}

      {!isLoading && !error && filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or create a new form template.</p>
        </div>
      )}
    </div>
  )
}
