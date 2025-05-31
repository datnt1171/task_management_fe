import React from "react"
import { Link } from "@/i18n/navigation"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, href, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none"

    const variantClasses = {
      default: "bg-black text-white hover:bg-gray-800",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
      ghost: "hover:bg-gray-100 text-gray-700",
    }

    const sizeClasses = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    }

    const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    if (asChild && href) {
      return (
        <Link href={href} className={allClasses}>
          {children}
        </Link>
      )
    }

    return (
      <button className={allClasses} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
