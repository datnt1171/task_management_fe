import type { NextRequest } from "next/server"
import { withAuth } from "../../auth/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, `/api/tasks/${params.id}/`)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, `/api/tasks/${params.id}/`, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, `/api/tasks/${params.id}/`, "DELETE")
}
