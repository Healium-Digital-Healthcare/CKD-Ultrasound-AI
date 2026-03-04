import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gradient-to-r from-muted via-muted to-muted rounded-md animate-pulse", className)}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Skeleton }
