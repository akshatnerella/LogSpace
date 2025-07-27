import { LoginForm } from '@/components/auth/LoginForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-scale-in">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center animate-glow">
              <span className="text-background font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold text-foreground">LogSpace</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Join LogSpace
            </h1>
            <p className="text-text-secondary">
              Start your building in public journey today.
            </p>
          </div>

          {/* Note */}
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-foreground text-center">
              <span className="font-semibold">Good news!</span> Just sign in with GitHub or Google below — we'll create your account automatically.
            </p>
          </div>

          {/* Redirect to login */}
          <div className="text-center">
            <a
              href="/login"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Continue to sign in →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
