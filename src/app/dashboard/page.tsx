import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { CreateFirstProject } from '@/components/dashboard/CreateFirstProject'
import { PrimaryCallToAction } from '@/components/dashboard/PrimaryCallToAction'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { ProTips } from '@/components/dashboard/ProTips'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, Builder! 👋
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Let&apos;s create your next project or explore the community.
          </p>
        </div>

        <div className="mb-8 sm:mb-10">
          <DashboardStats />
        </div>

        <div className="mb-8 sm:mb-10">
          <PrimaryCallToAction />
        </div>

        <div className="mb-8 sm:mb-10">
          <QuickActions />
        </div>

        <div className="mb-8 sm:mb-10">
          <CreateFirstProject />
          <RecentProjects />
        </div>

        <div className="mb-8 sm:mb-10">
          <ProTips />
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <a href="/create">
            <button
              className="w-14 h-14 bg-primary hover:bg-primary-dark text-background rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              title="Create New Project"
              aria-label="Create New Project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </a>
        </div>
      </main>
    </div>
  )
}