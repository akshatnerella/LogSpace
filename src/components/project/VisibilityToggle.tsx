'use client'

import { Eye, Lock } from 'lucide-react'

interface VisibilityToggleProps {
  value: 'public' | 'private'
  onChange: (visibility: 'public' | 'private') => void
  onFocus?: () => void
  onBlur?: () => void
  focused?: boolean
  disabled?: boolean
}

export function VisibilityToggle({ value, onChange, onFocus, onBlur, focused, disabled = false }: VisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange('public')}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          value === 'public'
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-surface text-muted-foreground border-border hover:bg-surface-hover'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          focused ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
        }`}
      >
        <Eye className="w-4 h-4" />
        <span className="text-sm font-medium">Public</span>
      </button>
      
      <button
        type="button"
        onClick={() => onChange('private')}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          value === 'private'
            ? 'bg-orange-600 text-white border-orange-600'
            : 'bg-surface text-muted-foreground border-border hover:bg-surface-hover'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          focused ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
        }`}
      >
        <Lock className="w-4 h-4" />
        <span className="text-sm font-medium">Private</span>
      </button>
    </div>
  )
}
