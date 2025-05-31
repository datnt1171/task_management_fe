"use client"

import type React from "react"

import { useState, useEffect, createContext } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Send, Inbox, LogOut, Menu, X, Loader2 } from "lucide-react"
import { getCurrentUser, logout, refreshToken } from "@/lib/api-service"

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  department?: {
    id: number
    name: string
  }
  role?: {
    id: number
    name: string
  }
  supervisor?: {
    id: number
    username: string
    first_name: string
    last_name: string
  }
}

export const UserContext = createContext<User | null>(null)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetchCurrentUser()

    // Set up token refresh interval
    const refreshInterval = setInterval(
      () => {
        // Refresh token every 25 minutes (5 minutes before the 30-minute expiry)
        refreshToken().catch(console.error)
      },
      25 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
      // If we can't get the user, we'll use a default or fallback
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      // Even if the API call fails, we'll still clear local storage and redirect
      localStorage.removeItem("user")
      router.push("/login")
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/forms", label: "Form Templates", icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/sent", label: "Sent Tasks", icon: <Send className="mr-2 h-4 w-4" /> },
    { href: "/dashboard/received", label: "Received Tasks", icon: <Inbox className="mr-2 h-4 w-4" /> },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold">Task Management</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link href="/dashboard/user" className="flex items-center w-full">
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.username || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.department?.name || user?.role?.name || ""}</p>
                </div>
              </Link>
              <Button variant="ghost" className="ml-auto" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold">Task Management</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <Link href="/dashboard/user" className="flex items-center w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.username || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.department?.name || user?.role?.name || ""}</p>
                  </div>
                </Link>
                <Button variant="ghost" className="ml-auto" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}
