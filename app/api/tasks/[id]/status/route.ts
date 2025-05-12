import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await axios.patch(`${process.env.API_URL}/api/tasks/${params.id}/status/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error updating task status:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to update task status" },
      { status: error.response?.status || 500 },
    )
  }
}
