'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { LogTile } from './LogTile'
import { LogDetailModal } from './LogDetailModal'
import { fetchProjectLogs } from '@/lib/queries'
import { ProjectLog } from '@/types/database'
import { supabase } from '@/lib/supabaseClient'

interface RecentLogsProps {
  projectId: string
  onAddLog: () => void
}

export function RecentLogs({ projectId, onAddLog }: RecentLogsProps) {
  const [logs, setLogs] = useState<ProjectLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<ProjectLog | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const fetchLogs = async () => {
    try {
      setError(null)
      const logsData = await fetchProjectLogs(projectId, 10)
      setLogs(logsData)
    } catch (err) {
      console.error('Error fetching logs:', err)
      setError('Failed to load recent logs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [projectId])

  const handleLogClick = (log: ProjectLog) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchLogs()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Logs</h2>
          <button
            onClick={onAddLog}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add New Log</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="p-4 rounded-xl border border-border bg-surface">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-hover rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-hover rounded w-3/4"></div>
                    <div className="h-3 bg-hover rounded w-full"></div>
                    <div className="h-3 bg-hover rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-foreground">Recent Logs</h2>
          <button
            onClick={handleRefresh}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-hover rounded-lg transition-colors"
            disabled={isLoading}
            aria-label="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button
            onClick={handleRefresh}
            className="ml-auto text-sm font-medium underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Logs List */}
      {logs.length > 0 ? (
        <div className="h-96 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LogTile 
                log={log} 
                onClick={handleLogClick}
              />
            </motion.div>
          ))}
          
          {logs.length === 10 && (
            <div className="text-center pt-4">
              <button className="text-sm text-muted-foreground hover:text-foreground underline hover:no-underline">
                View All Logs
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-hover rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No logs yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Start documenting your project journey by adding your first log entry.
          </p>
          <button
            onClick={onAddLog}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Log</span>
          </button>
        </div>
      )}
      
      {/* Log Detail Modal */}
      <LogDetailModal
        log={selectedLog}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </motion.div>
  )
}
