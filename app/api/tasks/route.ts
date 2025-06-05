import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (contentType.includes("multipart/form-data")) {
      // Handle multipart/form-data
      const form = await request.formData()
      const nodeForm = new FormData()
      for (const [key, value] of form.entries()) {
        if (typeof value === "object" && "arrayBuffer" in value) {
          const buffer = Buffer.from(await value.arrayBuffer())
          nodeForm.append(key, buffer, { filename: value.name, contentType: value.type })
        } else {
          nodeForm.append(key, value as string)
        }
      }
      const response = await axios.post(
        `${process.env.API_URL}/api/tasks/`,
        nodeForm,
        {
          headers: {
            ...nodeForm.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return NextResponse.json(response.data)
    } else {
      // Handle JSON
      const body = await request.json()
      const response = await axios.post(`${process.env.API_URL}/api/tasks/`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return NextResponse.json(response.data)
    }
  } catch (error: any) {
    console.error("Error creating task:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to create task" },
      { status: error.response?.status || 500 },
    )
  }
}
