'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogCard } from './LogCard'
import { mockLogs } from '@/data/mockLogs'
import type { MockLog } from '@/data/mockLogs'

export function LiveFeed() {
  const [visibleLogs, setVisibleLogs] = useState<MockLog[]>([])
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    // Initially show first 3 logs
    const initialLogs = mockLogs.slice(0, 3)
    setVisibleLogs(initialLogs)
    
    // Start "live" updates after initial load
    const timer = setTimeout(() => {
      setIsLive(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-6 py-3 bg-surface border border-border rounded-t-xl border-b-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">Live Feed</h3>
        </div>
        <div className="text-xs text-text-secondary px-2 py-1 bg-surface-hover rounded-full">
          {visibleLogs.length} active
        </div>
      </motion.div>

      {/* Feed Container */}
      <div className="bg-surface border border-border rounded-b-xl px-6 py-6 h-[320px] overflow-hidden">
        <div className="space-y-3 h-full">
          {visibleLogs.map((log, index) => (
            <LogCard key={log.id} log={log} index={index} />
          ))}
        </div>
        
        {/* Typing indicator when "live" */}
        {isLive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-6 flex items-center gap-2 text-text-secondary text-xs"
          >
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce delay-200" />
            </div>
            <span>Someone is logging...</span>
          </motion.div>
        )}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-xl pointer-events-none" />
    </div>
  )
}
