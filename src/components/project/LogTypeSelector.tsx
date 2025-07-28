"use client"

import { useState } from 'react'
import { X, FileText, Image, Code, ArrowRight, Construction } from 'lucide-react'
import { Button } from '../Button'

interface LogTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'text' | 'visual' | 'code') => void
  projectId: string
}

const logTypes = [
  {
    type: 'text' as const,
    icon: FileText,
    title: 'Text Log',
    description: 'Share thoughts, updates, and progress with rich text formatting',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    hoverBg: 'hover:bg-blue-400/20',
    isDefault: true,
    comingSoon: false
  },
  {
    type: 'visual' as const,
    icon: Image,
    title: 'Visual Log',
    description: 'Upload images, videos, or screenshots with captions',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    hoverBg: 'hover:bg-purple-400/20',
    isDefault: false,
    comingSoon: false
  },
  {
    type: 'code' as const,
    icon: Code,
    title: 'Code Snapshot',
    description: 'Share code snippets with syntax highlighting and context',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    hoverBg: 'hover:bg-green-400/20',
    isDefault: false,
    comingSoon: true
  }
]

export function LogTypeSelector({ isOpen, onClose, onSelectType, projectId }: LogTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'visual' | 'code'>('text')

  if (!isOpen) return null

  const handleSelectType = (type: 'text' | 'visual' | 'code') => {
    setSelectedType(type)
    const logType = logTypes.find(t => t.type === type)
    if (logType?.comingSoon) return
    onSelectType(type)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Choose Log Type
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                What kind of update would you like to share?
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {logTypes.map((logType) => {
              const Icon = logType.icon
              const isSelected = selectedType === logType.type
              
              return (
                <div
                  key={logType.type}
                  onClick={() => handleSelectType(logType.type)}
                  className={`
                    relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                    ${logType.bgColor} ${logType.borderColor}
                    ${isSelected 
                      ? `${logType.borderColor.replace('/20', '/60')} ring-2 ring-primary/20` 
                      : 'border-border hover:border-border-light'
                    }
                    ${logType.hoverBg}
                    ${logType.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Coming Soon Badge */}
                  {logType.comingSoon && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Construction className="w-3 h-3" />
                      Soon
                    </div>
                  )}

                  {/* Default Badge */}
                  {logType.isDefault && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 ${logType.bgColor} rounded-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${logType.color}`} />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {logType.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {logType.description}
                      </p>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && !logType.comingSoon && (
                    <div className={`absolute bottom-3 right-3 w-6 h-6 ${logType.bgColor} rounded-full flex items-center justify-center`}>
                      <ArrowRight className={`w-4 h-4 ${logType.color}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick tip */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-primary">💡 Pro tip:</span> You can always switch between log types. 
              Start with what feels natural and experiment as you go!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-light border-t border-border">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={() => handleSelectType(selectedType)}
              disabled={logTypes.find(t => t.type === selectedType)?.comingSoon}
              className="px-6 py-2 min-h-[40px]"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
