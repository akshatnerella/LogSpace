'use client'

import { motion } from 'framer-motion'
import { Eye, Lightbulb, Flag, MessageCircle, Search, Zap, Target, Users } from 'lucide-react'

// Custom animated icon components
const AnimatedEye = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Eye className="w-6 h-6 text-primary" />
    </motion.div>
    <motion.div
      className="absolute inset-0"
      animate={{ 
        rotate: [0, 360],
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Search className="w-3 h-3 text-accent absolute top-0 right-0" />
    </motion.div>
  </motion.div>
)

const AnimatedLightbulb = () => (
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
      <Lightbulb className="w-6 h-6 text-primary" />
    </motion.div>
    <motion.div
      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary rounded-full"
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.7
      }}
    />
  </motion.div>
)

const AnimatedFlag = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        x: [0, 2, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{ 
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Flag className="w-6 h-6 text-primary" />
    </motion.div>
    <motion.div
      className="absolute top-1 left-4 w-3 h-0.5 bg-gradient-to-r from-accent to-primary rounded-full"
      animate={{ 
        scaleX: [0.5, 1, 0.5],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.div>
)

const AnimatedMessageCircle = () => (
  <motion.div
    className="relative w-6 h-6"
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <MessageCircle className="w-6 h-6 text-primary" />
    </motion.div>
    <motion.div
      className="absolute top-2 left-1.5 flex gap-0.5"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-0.5 h-0.5 bg-accent rounded-full"
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -1, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </motion.div>
  </motion.div>
)

const features = [
  {
    icon: AnimatedEye,
    title: 'Discoverable Logs',
    description: 'Share your journey one log at a time.\nLet builders, collaborators, and future fans find you as you build.',
    delay: 0.1
  },
  {
    icon: AnimatedLightbulb,
    title: 'Transparent Ideas',
    description: 'Put your thought process out there.\nShare raw notes, prototypes, and aha moments that show how you think.',
    delay: 0.2
  },
  {
    icon: AnimatedFlag,
    title: 'Project Milestones',
    description: 'Set big goals and check off small wins.\nLogSpace helps you track the journey, not just the destination.',
    delay: 0.3
  },
  {
    icon: AnimatedMessageCircle,
    title: 'Community Feedback',
    description: 'Get insights from fellow builders.\nShare your updates and learn from others who\'ve been in your shoes.',
    delay: 0.4
  }
]

export function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-5">
            Tools to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Build Loud
            </span>
            ,{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Build Fast
            </span>
            , and{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Build Better
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            LogSpace gives you everything you need to stay accountable, attract attention, and grow your project: one public update at a time.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="relative p-6 sm:p-7 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon with Animation */}
                  <div className="relative mb-4">
                    <motion.div 
                      className="inline-flex p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300"
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      <Icon />
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Hover Border Gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 p-px">
                    <div className="w-full h-full bg-surface rounded-2xl" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
