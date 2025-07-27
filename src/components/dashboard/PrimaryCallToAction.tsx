import { Plus } from 'lucide-react'
import { Button } from '../Button'

export function PrimaryCallToAction() {
  return (
    <div className="text-center py-8 sm:py-12 animate-fade-in">
      {/* Main CTA Button */}
      <a href="/create-project">
        <Button 
          variant="primary" 
          size="lg" 
          className="group mb-4 px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold min-h-[56px] sm:min-h-[64px] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
          Create New Project
        </Button>
      </a>

      {/* Secondary Link */}
      <div className="text-sm sm:text-base text-text-secondary">
        or{' '}
        <button className="text-primary hover:text-primary-dark font-medium transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4 min-h-[44px] px-2">
          explore the community
        </button>
      </div>
    </div>
  )
}
