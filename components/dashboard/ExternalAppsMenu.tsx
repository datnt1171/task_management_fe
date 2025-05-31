"use client"

import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/ui/dropdown"
import { ExternalLink, ChevronDown } from "lucide-react"
import { externalApps } from "@/constants/navigation"

export function ExternalAppsMenu() {
  return (
    <>
      {/* Desktop External Apps */}
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
    </>
  )
}