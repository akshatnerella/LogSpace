"use client"

import { useState } from 'react'
import { X, FileText, Image, Code, ArrowRight, Construction } from 'lucide-react'
import { Button } from '../Button'

interface LogTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'text' | 'image' | 'url') => void
  projectId: string
}

const logTypes = [
  {
    type: 'url' as const,
    icon: Code,
    title: 'Link Log',
    description: 'Share relevant links and resources with context',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    hoverBg: 'hover:bg-green-400/20',
    isDefault: true,
    comingSoon: false
  },
  {
    type: 'text' as const,
    icon: FileText,
    title: 'Text Log',
    description: 'Share thoughts, updates, and progress with rich formatting',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    hoverBg: 'hover:bg-blue-400/20',
    isDefault: false,
    comingSoon: false
  },
  {
    type: 'image' as const,
    icon: Image,
    title: 'Visual Log',
    description: 'Upload images, videos, or screenshots with captions',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    hoverBg: 'hover:bg-purple-400/20',
    isDefault: false,
    comingSoon: false
  }
]

export function LogTypeSelector({ isOpen, onClose, onSelectType, projectId }: LogTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'image' | 'url'>('url')

  if (!isOpen) return null

  const handleSelectType = (type: 'text' | 'image' | 'url') => {
    setSelectedType(type)
    const logType = logTypes.find(t => t.type === type)
    if (logType?.comingSoon) return
    onSelectType(type)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Choose Log Type
            </h2>
            <p className="text-sm text-muted-foreground">
              What kind of update would you like to share?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-all duration-200 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {logTypes.map((logType) => {
            const Icon = logType.icon
            const isSelected = selectedType === logType.type
            
            return (
              <div
                key={logType.type}
                onClick={() => handleSelectType(logType.type)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group h-44 flex flex-col
                  ${isSelected 
                    ? `${logType.bgColor} ${logType.borderColor.replace('/20', '/50')} ring-2 ring-primary/20 shadow-lg` 
                    : `${logType.bgColor} ${logType.borderColor} hover:${logType.borderColor.replace('/20', '/40')} hover:shadow-md`
                  }
                  ${logType.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
                `}
              >
                {/* Coming Soon Badge */}
                {logType.comingSoon && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Construction className="w-3 h-3" />
                    Soon
                  </div>
                )}

                {/* Default Badge */}
                {logType.isDefault && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    Default
                  </div>
                )}

                <div className="flex flex-col items-center text-center h-full justify-between">
                  <div className="flex flex-col items-center space-y-3 flex-1 justify-center">
                    <div className={`w-12 h-12 ${logType.bgColor} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${logType.color}`} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {logType.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-tight">
                        {logType.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick tip */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-1">Pro tip</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can always switch between log types. Start with what feels natural and experiment as you go!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-surface-light/50 border-t border-border">
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
            className="px-8 py-2.5 min-h-[44px] font-semibold group"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  )
}
