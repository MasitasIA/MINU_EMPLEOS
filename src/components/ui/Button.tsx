import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-md shadow-primary/20",
      secondary: "bg-surface-muted text-foreground hover:bg-border",
      outline: "border border-border bg-transparent hover:bg-surface-muted text-foreground",
      ghost: "bg-transparent hover:bg-surface-muted text-foreground",
      danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:scale-[1.02]",
    }

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
      icon: "h-10 w-10 p-2 justify-center",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none radius-button",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
