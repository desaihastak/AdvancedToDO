import { cn } from "@/lib/utils"

/**
 * Icon Strategy for AdvancedToDo
 * 
 * Design System Alignment:
 * - Icons use lucide-react for consistency
 * - Sizing follows touch target guidelines (minimum 44px for touch)
 * - Colors map to Cosmic Violet theme
 * - Accessibility: All icons have aria-label or are decorative
 */

/**
 * Icon size variants following touch-first design
 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const iconSizes: Record<IconSize, string> = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
  "2xl": "w-12 h-12",
}

/**
 * Icon color variants mapped to Cosmic Violet theme
 */
export type IconColor = "primary" | "secondary" | "accent" | "surface" | "foreground" | "muted"

const iconColors: Record<IconColor, string> = {
  primary: "text-royal-violet",
  secondary: "text-indigo-velvet",
  accent: "text-lavender-purple",
  surface: "text-indigo-ink",
  foreground: "text-gray-900",
  muted: "text-gray-500",
}

/**
 * Icon component with consistent sizing and coloring
 * 
 * @param size - Icon size variant
 * @param color - Color variant from theme
 * @param className - Additional Tailwind classes
 * @param ariaLabel - Accessibility label (required if not decorative)
 * @param decorative - If true, icon is hidden from screen readers
 */
interface IconProps {
  size?: IconSize
  color?: IconColor
  className?: string
  ariaLabel?: string
  decorative?: boolean
  children: React.ReactNode
}

export function Icon({
  size = "md",
  color = "foreground",
  className,
  ariaLabel,
  decorative = false,
  children,
}: IconProps) {
  return (
    <span
      className={cn(
        iconSizes[size],
        iconColors[color],
        "inline-flex items-center justify-center transition-colors duration-200",
        className
      )}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
    >
      {children}
    </span>
  )
}

/**
 * Icon button component for touch-friendly icon interactions
 *
 * Combines icon with button for consistent touch targets (minimum 44px)
 */
interface IconButtonProps {
  size?: IconSize
  color?: IconColor
  className?: string
  ariaLabel?: string
  onClick?: () => void
  disabled?: boolean
  variant?: "ghost" | "outline" | "solid"
  children: React.ReactNode
}

export function IconButton({
  size = "md",
  color = "foreground",
  className,
  ariaLabel,
  onClick,
  disabled = false,
  variant = "ghost",
  children,
}: IconButtonProps) {
  const variantClasses = {
    ghost: "hover:bg-indigo-ink/20 active:bg-indigo-ink/30",
    outline: "border border-indigo-velvet/30 hover:bg-indigo-ink/20",
    solid: "bg-royal-violet hover:bg-indigo-velvet text-white",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center",
        variantClasses[variant],
        className
      )}
      aria-label={ariaLabel}
    >
      <Icon size={size} color={color}>
        {children}
      </Icon>
    </button>
  )
}

/**
 * Icon with label for clearer accessibility
 */
interface IconWithLabelProps {
  size?: IconSize
  color?: IconColor
  className?: string
  ariaLabel?: string
  label: string
  labelPosition?: "left" | "right" | "top" | "bottom"
  children: React.ReactNode
}

export function IconWithLabel({
  size = "sm",
  color = "foreground",
  className,
  label,
  labelPosition = "right",
  children,
}: IconWithLabelProps) {
  const positionClasses = {
    left: "flex-row-reverse",
    right: "flex-row",
    top: "flex-col-reverse",
    bottom: "flex-col",
  }

  return (
    <div className={cn("flex items-center gap-2", positionClasses[labelPosition])}>
      <Icon size={size} color={color} {...(className !== undefined && { className })}>
        {children}
      </Icon>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
