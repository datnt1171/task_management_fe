import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page
  redirect("/login")

  // This won't be rendered, but we include it for completeness
  return null
}
