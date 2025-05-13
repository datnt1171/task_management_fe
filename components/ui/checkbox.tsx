"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", checked = false, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked)

    const handleChange = () => {
      const newValue = !isChecked
      setIsChecked(newValue)
      onCheckedChange?.(newValue)
    }

    return (
      <div className="relative">
        <input type="checkbox" className="sr-only" ref={ref} checked={isChecked} onChange={handleChange} {...props} />
        <div
          className={`h-4 w-4 rounded-sm border border-gray-300 ${
            isChecked ? "bg-blue-600 border-blue-600" : "bg-white"
          } ${className}`}
          onClick={handleChange}
        >
          {isChecked && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
