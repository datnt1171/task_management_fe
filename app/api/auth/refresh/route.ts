import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "No refresh token found" }, { status: 401 })
    }

    // Make request to Django backend to refresh the token
    const response = await axios.post(
      `${process.env.API_URL}/api/token/refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } },
    )

    const { access } = response.data

    // Set new access token cookie
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60, // 5 minutes in seconds
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Token refresh error:", error.response?.data || error.message)

    // Clear cookies on refresh failure
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")

    return NextResponse.json(
      { success: false, error: error.response?.data || "Token refresh failed" },
      { status: error.response?.status || 500 },
    )
  }
}
