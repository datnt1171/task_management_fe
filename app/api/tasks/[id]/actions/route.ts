import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

export async function POST(
  request: Request, 
  context: { params: { id: string } }
) {
  const { id } = await context.params

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const response = await axios.post(
      `${process.env.API_URL}/api/tasks/${id}/action/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error performing task action:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to perform task action" },
      { status: error.response?.status || 500 }
    )
  }
}
