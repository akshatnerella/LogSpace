'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Image, Globe, Calendar, Tag, Pin, ExternalLink, Download, Share2 } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { useState } from 'react'
import { ProjectLog } from '@/types/database'

interface LogDetailModalProps {
  log: ProjectLog | null
  isOpen: boolean
  onClose: () => void
}

const typeConfig = {
  url: {
    icon: Globe,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800/30',
    label: 'Web Link'
  },
  text: {
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800/30',
    label: 'Text Entry'
  },
  image: {
    icon: Image,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800/30',
    label: 'Visual Update'
  },
  milestone: {
    icon: Calendar,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800/30',
    label: 'Milestone'
  }
}

export function LogDetailModal({ log, isOpen, onClose }: LogDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!log) return null

  const config = typeConfig[log.type]
  const Icon = config.icon

  // Get display title
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

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share log:', log.id)
  }

  const handleDownload = () => {
    if (log.type === 'image' && log.images && log.images.length > 0) {
      // TODO: Implement image download
      console.log('Download images:', log.images)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b border-border ${config.bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Type Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold text-foreground">
                        {getDisplayTitle()}
                      </h1>
                      {log.is_pinned && (
                        <Pin className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-hover rounded-lg transition-colors"
                    title="Share log"
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {log.type === 'image' && log.images && log.images.length > 0 && (
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-hover rounded-lg transition-colors"
                      title="Download images"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-hover rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Metadata */}
                <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-xl">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(log.timeline_date), 'PPP')}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                  </div>
                  
                  {/* Tags */}
                  {log.tags && log.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <div className="flex space-x-1">
                        {log.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-background border border-border rounded-full text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Type-specific Content */}
                {log.type === 'text' && (
                  <div className="space-y-4">
                    {log.summary && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Summary</h3>
                        <p className="text-muted-foreground bg-surface-light p-4 rounded-xl leading-relaxed">
                          {log.summary}
                        </p>
                      </div>
                    )}
                    
                    {log.content && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Content</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground bg-surface-light p-4 rounded-xl">
                          <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                            {log.content}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {log.type === 'image' && (
                  <div className="space-y-4">
                    {log.summary && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                        <p className="text-muted-foreground bg-surface-light p-4 rounded-xl leading-relaxed">
                          {log.summary}
                        </p>
                      </div>
                    )}
                    
                    {log.images && log.images.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">
                          Images ({log.images.length})
                        </h3>
                        
                        {/* Main Image */}
                        <div className="mb-4">
                          <img
                            src={log.images[selectedImageIndex]}
                            alt={`Image ${selectedImageIndex + 1}`}
                            className="w-full h-auto max-h-96 object-contain rounded-xl border border-border"
                          />
                        </div>
                        
                        {/* Image Thumbnails */}
                        {log.images.length > 1 && (
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {log.images.map((imageUrl, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                title={`View image ${index + 1}`}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                                  selectedImageIndex === index
                                    ? 'border-primary shadow-lg'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {log.type === 'url' && (
                  <div className="space-y-4">
                    {log.summary && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                        <p className="text-muted-foreground bg-surface-light p-4 rounded-xl leading-relaxed">
                          {log.summary}
                        </p>
                      </div>
                    )}
                    
                    {log.source_link && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Link</h3>
                        <a
                          href={log.source_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-3 bg-surface-light hover:bg-hover rounded-xl transition-colors group"
                        >
                          <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          <span className="text-muted-foreground group-hover:text-primary truncate">
                            {log.source_link}
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </a>
                      </div>
                    )}
                    
                    {log.content && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Content</h3>
                        <div className="text-muted-foreground bg-surface-light p-4 rounded-xl leading-relaxed">
                          <pre className="whitespace-pre-wrap font-sans">
                            {log.content}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
