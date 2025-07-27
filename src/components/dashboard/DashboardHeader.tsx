import { Bell, Search, User } from 'lucide-react'
import { Button } from '../Button'

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-base sm:text-lg">L</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground">LogSpace</span>
        </div>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search projects, builders..."
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile search button */}
          <Button variant="ghost" className="lg:hidden p-2 h-auto min-h-[44px]">
            <Search className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" className="relative p-2 h-auto min-h-[44px]">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          
          <Button variant="ghost" className="flex items-center space-x-2 p-2 h-auto min-h-[44px]">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              Builder
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
