'use client'

import { useState } from 'react'
import { Button } from '../Button'
import { GitHubIcon, GoogleIcon } from '../icons'
import { LoadingSpinner } from '../LoadingSpinner'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(provider)
    
    // Simulate OAuth flow - replace with actual auth logic
    try {
      // TODO: Implement actual OAuth with Clerk/Firebase
      console.log(`Logging in with ${provider}...`)
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
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
            Sign in to LogSpace
          </h1>
          <p className="text-text-secondary">
            Track your journey. Build in public.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => handleOAuthLogin('github')}
            disabled={!!isLoading}
            className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading === 'github' ? (
              <LoadingSpinner size="sm" className="text-black" />
            ) : (
              <GitHubIcon />
            )}
            Continue with GitHub
          </Button>

          <Button
            onClick={() => handleOAuthLogin('google')}
            disabled={!!isLoading}
            className="w-full bg-[#4285F4] text-white hover:bg-[#357ae8] flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading === 'google' ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <span className="text-primary font-medium">
              Logging in will create one automatically.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
