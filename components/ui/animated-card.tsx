"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  delay?: number
  children: React.ReactNode
}

export function AnimatedCard({ delay = 0, children, className, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: delay * 0.05,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Card className={cn("h-full transition-all duration-200", className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}

