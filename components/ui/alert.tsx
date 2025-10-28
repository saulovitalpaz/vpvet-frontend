import * as React from "react"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  AlertCircle,
  Star
} from "lucide-react"

type AlertVariant = "default" | "primary" | "success" | "warning" | "error" | "info" | "loading"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  icon?: React.ReactNode
  showIcon?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon, showIcon = true, children, ...props }, ref) => {
    const getDefaultIcon = () => {
      const iconClassName = "h-4 w-4 flex-shrink-0"
      switch (variant) {
        case "primary":
          return <Star className={cn(iconClassName, "text-emerald-600")} />
        case "success":
          return <CheckCircle2 className={cn(iconClassName, "text-green-600")} />
        case "warning":
          return <AlertTriangle className={cn(iconClassName, "text-amber-600")} />
        case "error":
          return <XCircle className={cn(iconClassName, "text-red-600")} />
        case "info":
          return <Info className={cn(iconClassName, "text-emerald-600")} />
        case "loading":
          return <Loader2 className={cn(iconClassName, "text-emerald-600 animate-spin")} />
        default:
          return <AlertCircle className={cn(iconClassName, "text-gray-600")} />
      }
    }

    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "border-emerald-200 bg-emerald-50 text-emerald-900"
        case "success":
          return "border-green-200 bg-green-50 text-green-900"
        case "warning":
          return "border-amber-200 bg-amber-50 text-amber-900"
        case "error":
          return "border-red-200 bg-red-50 text-red-900"
        case "info":
          return "border-emerald-200 bg-emerald-50 text-emerald-900"
        case "loading":
          return "border-gray-200 bg-gray-50 text-gray-900"
        default:
          return "bg-white text-gray-900 border-gray-200"
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          showIcon && "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute left-4 top-4",
          getVariantClasses(),
          className
        )}
        {...props}
      >
        {showIcon && (icon || getDefaultIcon())}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: AlertVariant
  }
>(({ className, variant = "default", ...props }, ref) => {
  const getTitleClasses = () => {
    switch (variant) {
      case "primary":
        return "text-emerald-900"
      case "success":
        return "text-green-900"
      case "warning":
        return "text-amber-900"
      case "error":
        return "text-red-900"
      case "info":
        return "text-emerald-900"
      case "loading":
        return "text-gray-900"
      default:
        return "text-gray-900"
    }
  }

  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", getTitleClasses(), className)}
      {...props}
    />
  )
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: AlertVariant
  }
>(({ className, variant = "default", ...props }, ref) => {
  const getDescriptionClasses = () => {
    switch (variant) {
      case "primary":
        return "text-emerald-700"
      case "success":
        return "text-green-700"
      case "warning":
        return "text-amber-700"
      case "error":
        return "text-red-700"
      case "info":
        return "text-emerald-700"
      case "loading":
        return "text-gray-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", getDescriptionClasses(), className)}
      {...props}
    />
  )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }