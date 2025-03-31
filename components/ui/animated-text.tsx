"use client"

import type React from "react"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  as?: React.ElementType
}

export function AnimatedText({ text, className, delay = 0, as: Component = "h1" }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Component className={className}>{text}</Component>
    </motion.div>
  )
}

