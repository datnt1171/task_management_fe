"use client"

import type React from "react"
import { useState, useEffect, createContext, useRef } from "react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useLocale } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Inbox, 
  LogOut, 
  Menu, 
  X, 
  Loader2,
  Globe,
  ChevronDown,
  ExternalLink
} from "lucide-react"
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

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vn', name: 'Tiếng Việt', flag: '🇻🇳' }
]

// External app links - replace with your actual URLs
const externalApps = [
  { name: 'CRM System', url: 'https://crm.yourcompany.com', icon: '📊' },
  { name: 'HR Portal', url: 'https://hr.yourcompany.com', icon: '👥' },
  { name: 'Finance App', url: 'https://finance.yourcompany.com', icon: '💰' },
  { name: 'Reports', url: 'https://reports.yourcompany.com', icon: '📈' }
]

// Custom Dropdown Component
interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    setIsClient(true)
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
      // If we can't get the user, handle gracefully without localStorage
      // You might want to redirect to login or show an error state
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      if (isClient && typeof window !== 'undefined') {
        localStorage.removeItem("user")
      }
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      // Even if the API call fails, we'll still clear local storage and redirect
      if (isClient && typeof window !== 'undefined') {
        localStorage.removeItem("user")
      }
      router.push("/login")
    }
  }

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
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

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
          <div className="flex items-center justify-between px-4 py-3 h-full">
            {/* Left side - Mobile menu button + Logo */}
            <div className="flex items-center">
              <div className="md:hidden mr-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                  className="h-8 w-8"
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
              <div className="md:w-64 md:pr-4">
                <h1 className="text-xl font-bold text-gray-900">Task Management</h1>
              </div>
            </div>

            {/* Right side - External apps + Language selector + User menu */}
            <div className="flex items-center space-x-3">
              {/* External Apps - Hidden on mobile to save space */}
              <div className="hidden lg:flex items-center space-x-2">
                {externalApps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <span className="mr-1">{app.icon}</span>
                    {app.name}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ))}
              </div>

              {/* Mobile External Apps Dropdown */}
              <div className="lg:hidden">
                <Dropdown
                  trigger={
                    <Button variant="outline" size="sm" className="flex items-center">
                      Apps <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  }
                >
                  <div className="py-1">
                    {externalApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="mr-2">{app.icon}</span>
                        {app.name}
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </Dropdown>
              </div>

              {/* Language Selector */}
              <div className="w-32">
                <Select
                  value={locale}
                  onValueChange={handleLanguageChange}
                  className="h-8"
                >
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* User Menu */}
              <Dropdown
                trigger={
                  <Button variant="ghost" size="sm" className="flex items-center h-10 px-2">
                    <div className="text-right mr-2 hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">{user?.username || "User"}</p>
                      <p className="text-xs text-gray-500 truncate max-w-24">
                        {user?.department?.name || user?.role?.name || ""}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.first_name?.[0] || user?.username?.[0] || "U"}
                      </span>
                    </div>
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                }
              >
                <div className="py-1">
                  <Link
                    href="/dashboard/user"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0" style={{ top: '64px' }}>
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
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
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden" style={{ top: '64px' }}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
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
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1" style={{ paddingTop: '64px' }}>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}