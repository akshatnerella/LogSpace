import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { CreateFirstProject } from '@/components/dashboard/CreateFirstProject'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to LogSpace! 👋
          </h1>
          <p className="text-text-secondary">
            Ready to start building in public? Let's create your first project log.
          </p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            <CreateFirstProject />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-2xl p-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-background border border-border rounded-xl hover:border-border-hover transition-colors">
                  <div className="font-medium text-foreground text-sm">Create Log</div>
                  <div className="text-text-muted text-xs">Share your progress</div>
                </button>
                <button className="w-full text-left p-3 bg-background border border-border rounded-xl hover:border-border-hover transition-colors">
                  <div className="font-medium text-foreground text-sm">Explore Community</div>
                  <div className="text-text-muted text-xs">Discover other builders</div>
                </button>
                <button className="w-full text-left p-3 bg-background border border-border rounded-xl hover:border-border-hover transition-colors">
                  <div className="font-medium text-foreground text-sm">Setup Profile</div>
                  <div className="text-text-muted text-xs">Complete your profile</div>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">💡 Pro Tips</h3>
              <div className="space-y-3 text-sm text-text-secondary">
                <div>• Share updates regularly to build momentum</div>
                <div>• Engage with other builders for feedback</div>
                <div>• Use hashtags to reach the right audience</div>
                <div>• Be authentic about your challenges</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
