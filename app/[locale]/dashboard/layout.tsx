"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import { UserContext } from "@/contexts/UserContext"
import { useAuth } from "@/hooks/useAuth"
import { useMobileMenu } from "@/hooks/useMobileMenu"
import { TopNavbar } from "@/components/dashboard/TopNavbar"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { MobileMenu } from "@/components/dashboard/MobileMenu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, handleLogout } = useAuth()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

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
        <TopNavbar 
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={handleLogout}
        />

        <Sidebar />

        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1" style={{ paddingTop: '64px' }}>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}