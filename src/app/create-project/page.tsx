import { CreateProjectForm } from '@/components/project/CreateProjectForm'

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              🚀 New Project
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Just the basics. You can always update later.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <CreateProjectForm />
      </main>
    </div>
  )
}
