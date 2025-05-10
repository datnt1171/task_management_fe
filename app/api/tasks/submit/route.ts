import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { processId, assignee, formValues } = body

    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Transform the form values to match your API's expected format
    const taskData = {
      process: processId,
      assignee: assignee,
      fields: Object.entries(formValues).map(([key, value]) => ({
        field_id: key.replace("field_", ""), // Remove the "field_" prefix we added
        value: value,
      })),
    }

    // Send the task data to your Django backend
    const response = await axios.post(`${process.env.API_URL}/api/tasks/`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return NextResponse.json({ success: true, task: response.data })
  } catch (error: any) {
    console.error("Error submitting task:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to submit task" },
      { status: error.response?.status || 500 },
    )
  }
}
