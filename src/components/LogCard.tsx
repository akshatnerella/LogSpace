'use client'

import { motion } from 'framer-motion'
import type { MockLog } from '@/data/mockLogs'

interface LogCardProps {
  log: MockLog
  index: number
}

export function LogCard({ log, index }: LogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-surface border border-border p-4 rounded-xl hover:border-primary/30 hover:bg-surface-hover transition-all duration-200 group"
    >
      {/* User Info and Content - Horizontal Layout */}
      <div className="flex items-start gap-4">
        <img 
          src={log.avatar} 
          alt={log.user}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-border group-hover:ring-primary/30 transition-all duration-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-foreground truncate">{log.user}</p>
            {log.icon && (
              <span className="text-sm opacity-70">{log.icon}</span>
            )}
            <span className="text-xs text-text-secondary">•</span>
            <p className="text-xs text-text-secondary">{log.timestamp}</p>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 overflow-hidden">{log.content}</p>
        </div>
      </div>
    </motion.div>
  )
}
