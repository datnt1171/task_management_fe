import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await axios.get(`${process.env.API_URL}/api/processes/processes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    // Transform the API response to match our expected format
    const formTemplates = response.data.results.reduce((acc: Record<string, any>, process: any) => {
      acc[process.id] = {
        id: process.id,
        title: process.name,
        description: `Form template for ${process.name}`, // Generate a description since API doesn't provide one
        fields: process.fields.map((field: any) => ({
          id: `field_${field.id}`,
          label: field.name,
          type: mapFieldType(field.field_type),
          required: field.required,
          options: field.field_type === "select" ? [] : undefined, // API doesn't provide options for select fields
        })),
      }
      return acc
    }, {})

    return NextResponse.json({ formTemplates })
  } catch (error: any) {
    console.error("Error fetching form templates:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch form templates" },
      { status: error.response?.status || 500 },
    )
  }
}

// Helper function to map API field types to our field types
function mapFieldType(apiFieldType: string): string {
  switch (apiFieldType) {
    case "text":
      return "text"
    case "number":
      return "number"
    case "date":
      return "date"
    case "select":
      return "select"
    case "checkbox":
      return "checkbox"
    case "textarea":
      return "textarea"
    default:
      return "text"
  }
}
