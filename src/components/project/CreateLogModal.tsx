'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Image, Globe, ArrowRight } from 'lucide-react'
import { LogTypeSelector } from './LogTypeSelector'
import { TextLogModal } from './TextLogModal'
import { ImageLogModal } from './ImageLogModal'
import { UrlLogModal } from './UrlLogModal'

interface CreateLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
}

export function CreateLogModal({ isOpen, onClose, onSuccess, projectId }: CreateLogModalProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'image' | 'url' | null>(null)

  const handleTypeSelect = (type: 'text' | 'image' | 'url') => {
    setSelectedType(type)
  }

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null)
    } else {
      onClose()
    }
  }

  const handleModalClose = () => {
    setSelectedType(null)
    onClose()
  }

  const handleSuccess = () => {
    setSelectedType(null)
    onSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleModalClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {!selectedType ? (
              <LogTypeSelector
                isOpen={true}
                onClose={handleModalClose}
                onSelectType={handleTypeSelect}
                projectId={projectId}
              />
            ) : selectedType === 'text' ? (
              <TextLogModal
                isOpen={true}
                onClose={handleBack}
                onSuccess={handleSuccess}
                projectId={projectId}
              />
            ) : selectedType === 'image' ? (
              <ImageLogModal
                isOpen={true}
                onClose={handleBack}
                onSuccess={handleSuccess}
                projectId={projectId}
              />
            ) : selectedType === 'url' ? (
              <UrlLogModal
                isOpen={true}
                onClose={handleBack}
                onSuccess={handleSuccess}
                projectId={projectId}
              />
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
