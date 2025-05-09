import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

// Helper function to forward requests to Django with auth token
export async function withAuth(request: NextRequest, endpoint: string, method = "GET") {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Clone the request to get the body if needed
    const requestClone = request.clone()
    let body = null

    if (method !== "GET" && method !== "HEAD") {
      body = await requestClone.json()
    }

    // Forward the request to Django
    const response = await axios({
      method,
      url: `${process.env.API_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: body,
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("API request error:", error.response?.data || error.message)

    return NextResponse.json(
      { error: error.response?.data || "API request failed" },
      { status: error.response?.status || 500 },
    )
  }
}
