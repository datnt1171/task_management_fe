"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end"
  sideOffset?: number
  children: React.ReactNode
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <>{children}</>
}

export function DropdownMenuTrigger({ asChild = false, children }: DropdownMenuTriggerProps) {
  return <>{children}</>
}

export function DropdownMenuContent({
  align = "end",
  sideOffset = 4,
  className = "",
  children,
  ...props
}: DropdownMenuContentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Toggle the dropdown when the trigger is clicked
  useEffect(() => {
    const trigger = document.querySelector("[data-dropdown-trigger='true']")

    const handleClick = () => {
      setIsOpen(!isOpen)
    }

    trigger?.addEventListener("click", handleClick)

    return () => {
      trigger?.removeEventListener("click", handleClick)
    }
  }, [isOpen])

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md ${className}`}
      style={{
        position: "absolute",
        top: `calc(100% + ${sideOffset}px)`,
        right: align === "end" ? 0 : "auto",
        left: align === "start" ? 0 : "auto",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className = "", inset, ...props }: DropdownMenuItemProps) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${
        inset ? "pl-8" : ""
      } ${className}`}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} {...props} />
}
