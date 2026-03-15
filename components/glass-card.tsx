"use client"

import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export function GlassCard({ children, className, animate = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-8",
        animate && "animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  )
}
