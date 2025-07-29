import { Lightbulb, Check } from 'lucide-react'

const tips = [
  {
    id: 1,
    text: 'Share updates regularly to build momentum',
    completed: false
  },
  {
    id: 2,
    text: 'Be transparent about challenges',
    completed: true
  },
  {
    id: 3,
    text: 'Use hashtags to gain visibility',
    completed: false
  },
  {
    id: 4,
    text: 'Engage with others for feedback',
    completed: false
  }
]

export function ProTips() {
  return (
    <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          💡 Pro Tips
        </h3>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors duration-200 ${
              tip.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-border hover:border-accent cursor-pointer'
            }`}>
              {tip.completed && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            
            <p className={`text-sm sm:text-base transition-colors duration-200 ${
              tip.completed 
                ? 'text-text-secondary line-through' 
                : 'text-foreground'
            }`}>
              {tip.text}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-accent/10">
        <p className="text-xs sm:text-sm text-text-secondary text-center">
          Complete these actions to maximize your reach and engagement
        </p>
      </div>
    </div>
  )
}
