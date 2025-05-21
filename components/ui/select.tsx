"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  placeholder?: string
  disabled?: boolean
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onSelect?: () => void
}

export function Select({ value, onValueChange, children, placeholder, disabled, className = "" }: SelectProps) {
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

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        disabled={disabled}
      >
        <span className={!value ? "text-gray-400" : ""}>
          {value || placeholder || "Select an option"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {React.Children.map(children, (child) => {
            if (React.isValidElement<SelectItemProps>(child)) {
              return React.cloneElement(child, {
                onSelect: () => {
                  onValueChange(child.props.value)
                  setOpen(false)
                },
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

export function SelectItem({ value, children, className = "", onSelect }: SelectItemProps) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 ${className}`}
      onClick={onSelect}
    >
      {children}
    </div>
  )
}
