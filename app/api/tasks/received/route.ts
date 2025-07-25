import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import axios from "axios"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language") || "en-US,en;q=0.9"

    const response = await axios.get(`${process.env.API_URL}/api/tasks/received/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error fetching received tasks:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch received tasks" },
      { status: error.response?.status || 500 },
    )
  }
}
