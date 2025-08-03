'use client'

import { motion } from 'framer-motion'
import { Edit3, Bot, Globe, Sparkles, FileText, Share2 } from 'lucide-react'

// Custom animated icon components
const AnimatedTyping = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        rotate: [0, 2, -2, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Edit3 className="w-6 h-6 text-white" />
    </motion.div>
    <motion.div
      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.div>
)

const AnimatedAI = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Bot className="w-6 h-6 text-white" />
    </motion.div>
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-accent rounded-full"
        style={{
          top: `${10 + Math.sin(i * Math.PI / 2) * 8}px`,
          left: `${10 + Math.cos(i * Math.PI / 2) * 8}px`,
        }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5
        }}
      />
    ))}
  </motion.div>
)

const AnimatedShare = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        x: [0, 2, 0],
        y: [0, -1, 0]
      }}
      transition={{ 
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Share2 className="w-6 h-6 text-white" />
    </motion.div>
    <motion.div
      className="absolute top-1 right-0 w-3 h-0.5 bg-gradient-to-r from-accent to-transparent rounded-full"
      animate={{ 
        scaleX: [0, 1, 0],
        opacity: [0, 1, 0]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut"
      }}
    />
  </motion.div>
)

const steps = [
  {
    icon: AnimatedTyping,
    number: '01',
    title: 'Connect Your Tools',
    description: 'Link your GitHub, LinkedIn, Notion, Slack, or any tool you use to build.\nOr simply paste a link to your latest post or update.',
    delay: 0.1
  },
  {
    icon: AnimatedAI,
    number: '02', 
    title: 'Let the AI Curate Your Journey',
    description: 'Our AI pulls updates from your connected tools, organizes your progress, and turns it into structured logs, milestones, and visual summaries.',
    delay: 0.2
  },
  {
    icon: AnimatedShare,
    number: '03',
    title: 'Publish and Grow Publicly',
    description: 'Your project\'s public dashboard updates automatically.\nShow your build journey, attract support, and grow your audience.',
    delay: 0.3
  }
]

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-surface/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-surface/20 to-background/50" />
      
      <div className="relative w-full max-w-none px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 max-w-7xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Just connect your tools. We&apos;ll build your public journey for you.
          </p>
        </motion.div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative max-w-7xl mx-auto">
          
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="relative text-center group"
              >
                <div className="relative z-10 space-y-6">
                  {/* Icon and Number Side by Side */}
                  <div className="flex items-center justify-center space-x-4">
                    {/* Icon Container */}
                    <motion.div 
                      className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      <Icon />
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
                    </motion.div>
                    
                    {/* Step Number - Unboxed */}
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto whitespace-pre-line">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
