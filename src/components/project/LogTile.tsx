'use client'

import { motion } from 'framer-motion'
import { FileText, Image, Globe, Calendar, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ProjectLog } from '@/types/database'

interface LogTileProps {
  log: ProjectLog
  onClick?: (log: ProjectLog) => void
}

const typeConfig = {
  text: {
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800/30'
  },
  image: {
    icon: Image,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800/30'
  },
  url: {
    icon: Globe,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800/30'
  },
  milestone: {
    icon: Calendar,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800/30'
  }
}

export function LogTile({ log, onClick }: LogTileProps) {
  const config = typeConfig[log.type]
  const Icon = config.icon

  // Get display title - use title if available, otherwise generate from content/type
  const getDisplayTitle = () => {
    if (log.title) return log.title
    if (log.type === 'url' && log.source_link) {
      try {
        const url = new URL(log.source_link)
        return `Link from ${url.hostname}`
      } catch {
        return 'Web Link'
      }
    }
    if (log.type === 'image') return 'Visual Update'
    return 'Text Update'
  }

  // Get display description
  const getDisplayDescription = () => {
    if (log.summary) return log.summary
    if (log.content) {
      // Truncate content if too long
      return log.content.length > 120 
        ? log.content.substring(0, 120) + '...'
        : log.content
    }
    if (log.type === 'image' && log.images?.length) {
      return `${log.images.length} image${log.images.length > 1 ? 's' : ''} uploaded`
    }
    return 'No description available'
  }

  const handleClick = () => {
    if (onClick) {
      onClick(log)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`relative p-4 rounded-xl border ${config.borderColor} ${config.bgColor} hover:shadow-lg transition-all duration-200 cursor-pointer group`}
    >
      {/* Pinned indicator */}
      {log.is_pinned && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></div>
      )}

      <div className="flex items-start space-x-4">
        {/* Type Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Timestamp */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-200 line-clamp-1">
              {getDisplayTitle()}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground ml-2 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(log.timeline_date), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {getDisplayDescription()}
          </p>

          {/* Tags and Image Preview */}
          <div className="flex items-center justify-between">
            {/* Tags */}
            {log.tags && log.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <div className="flex space-x-1">
                  {log.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-background border border-border rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {log.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{log.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Image Preview for image logs */}
            {log.type === 'image' && log.images && log.images.length > 0 && (
              <div className="flex -space-x-1">
                {log.images.slice(0, 3).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded border-2 border-background overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {log.images.length > 3 && (
                  <div className="w-6 h-6 rounded border-2 border-background bg-hover flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{log.images.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </motion.div>
  )
}
