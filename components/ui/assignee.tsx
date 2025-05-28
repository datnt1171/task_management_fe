"use client"

import React, { useState, useRef, useEffect, createContext, useContext } from "react"
import { ChevronDown } from "lucide-react"

// Context for Assignee component
interface AssigneeContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  disabled?: boolean
}

const AssigneeContext = createContext<AssigneeContextType | undefined>(undefined)

const useAssigneeContext = () => {
  const context = useContext(AssigneeContext)
  if (!context) {
    throw new Error("Assignee components must be used within a Select")
  }
  return context
}

// Main Select component
interface AssigneeProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function Assignee({ value, onValueChange, children, disabled, className = "" }: AssigneeProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const contextValue: AssigneeContextType = {
    value,
    onValueChange,
    open,
    setOpen,
    disabled
  }

  return (
    <AssigneeContext.Provider value={contextValue}>
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    </AssigneeContext.Provider>
  )
}

// SelectTrigger component
interface AssigneeTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AssigneeTrigger({ children, className = "" }: AssigneeTriggerProps) {
  const { open, setOpen, disabled } = useAssigneeContext()

  return (
    <button
      type="button"
      onClick={() => !disabled && setOpen(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
      disabled={disabled}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

// SelectValue component
interface AssigneeValueProps {
  placeholder?: string
  className?: string
  formatDisplay?: (value: string) => string // Add formatDisplay prop
}

export function AssigneeValue({ 
  placeholder, 
  className = "", 
  formatDisplay // Add this prop
}: AssigneeValueProps) {
  const { value } = useAssigneeContext()

  // Use formatDisplay if provided, otherwise use raw value
  const displayValue = value && formatDisplay 
    ? formatDisplay(value) 
    : value

  return (
    <span className={`${!value ? "text-gray-400" : ""} ${className}`}>
      {displayValue || placeholder || "Select an option"}
    </span>
  )
}

// SelectContent component
interface AssigneeContentProps {
  children: React.ReactNode
  className?: string
}

export function AssigneeContent({ children, className = "" }: AssigneeContentProps) {
  const { open } = useAssigneeContext()

  if (!open) return null

  return (
    <div className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ${className}`}>
      {children}
    </div>
  )
}

// SelectItem component
interface AssigneeItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AssigneeItem({ value, children, className = "" }: AssigneeItemProps) {
  const { onValueChange, setOpen, value: selectedValue } = useAssigneeContext()

  const handleAssignee = () => {
    onValueChange(value)
    setOpen(false)
  }

  const isAssignee = selectedValue === value

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 ${
        isAssignee ? "bg-gray-100" : ""
      } ${className}`}
      onClick={handleAssignee}
    >
      {children}
    </div>
  )
}