"use client"

import { useContext } from "react"
import { useTranslations } from 'next-intl'
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/ui/dropdown"
import { LogOut, ChevronDown } from "lucide-react"
import { UserContext } from "@/contexts/UserContext"

interface UserMenuProps {
  onLogout: () => void
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const user = useContext(UserContext)
  const t = useTranslations()

  return (
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
          {t('dashboard.userMenu.profile')}
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('dashboard.userMenu.logout')}
        </button>
      </div>
    </Dropdown>
  )
}