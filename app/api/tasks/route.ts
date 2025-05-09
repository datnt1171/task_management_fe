import type { NextRequest } from "next/server"
import { withAuth } from "../auth/middleware"

// Example of a route that forwards requests to Django
export async function GET(request: NextRequest) {
  return withAuth(request, "/api/tasks/")
}

export async function POST(request: NextRequest) {
  return withAuth(request, "/api/tasks/", "POST")
}
