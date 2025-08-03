'use client'

import { motion } from 'framer-motion'
import { Eye, Lock } from 'lucide-react'

interface VisibilityToggleProps {
  value: 'public' | 'private'
  onChange: (value: 'public' | 'private') => void
  onFocus: () => void
  onBlur: () => void
  focused: boolean
}

export function VisibilityToggle({ value, onChange, onFocus, onBlur, focused }: VisibilityToggleProps) {
  return (
    <motion.div 
      className={`relative bg-surface/50 backdrop-blur-xl border-2 rounded-xl p-4 sm:p-5 transition-all duration-300 ${
        focused
          ? 'border-accent shadow-xl shadow-accent/20 bg-surface/80' 
          : 'border-border hover:border-border-hover hover:bg-surface/70'
      }`}
      whileHover={{ scale: focused ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">3</span>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Visibility</h3>
          <p className="text-xs text-muted-foreground">Who can see your project?</p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Public Option */}
        <motion.label
          className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
            value === 'public'
              ? 'bg-primary/10 border-2 border-primary'
              : 'bg-background/50 border-2 border-border hover:border-border-hover hover:bg-background/70'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={value === 'public'}
            onChange={(e) => onChange(e.target.value as 'public' | 'private')}
            className="sr-only"
            aria-label="Set project visibility to public"
          />
          
          {/* Custom Radio */}
          <div className={`relative w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
            value === 'public' ? 'border-primary bg-primary' : 'border-border group-hover:border-primary'
          }`}>
            {value === 'public' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            )}
          </div>
          
          <div className="flex items-center flex-1">
            <div className={`p-1.5 rounded-lg mr-2 ${
              value === 'public' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
            }`}>
              <Eye className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">Public</div>
              <div className="text-xs text-muted-foreground">Anyone can discover and view your project</div>
            </div>
          </div>
          
          {value === 'public' && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-primary ml-2"
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </motion.div>
          )}
        </motion.label>

        {/* Private Option */}
        <motion.label
          className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
            value === 'private'
              ? 'bg-gray-500/10 border-2 border-gray-500'
              : 'bg-background/50 border-2 border-border hover:border-border-hover hover:bg-background/70'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <input
            type="radio"
            name="visibility"
            value="private"
            checked={value === 'private'}
            onChange={(e) => onChange(e.target.value as 'public' | 'private')}
            className="sr-only"
            aria-label="Set project visibility to private"
          />
          
          {/* Custom Radio */}
          <div className={`relative w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
            value === 'private' ? 'border-gray-500 bg-gray-500' : 'border-border group-hover:border-gray-500'
          }`}>
            {value === 'private' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            )}
          </div>
          
          <div className="flex items-center flex-1">
            <div className={`p-1.5 rounded-lg mr-2 ${
              value === 'private' ? 'bg-gray-500 text-white' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">Private</div>
              <div className="text-xs text-muted-foreground">Only you can access and view this project</div>
            </div>
          </div>
          
          {value === 'private' && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-gray-500 ml-2"
            >
              <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </motion.div>
          )}
        </motion.label>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        You can change this anytime from your project settings
      </p>
    </motion.div>
  )
}
