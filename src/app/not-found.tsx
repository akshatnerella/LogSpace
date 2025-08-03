'use client'

import Link from 'next/link'
import { Button } from '@/components/Button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary/20">404</div>
          <h1 className="text-3xl font-bold text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" href="/" className="group">
            <Home className="mr-2 w-4 h-4" />
            Go Home
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        {/* Help */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-text-muted">
            Need help? Contact us at{' '}
            <a 
              href="mailto:help@logspace.com" 
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              help@logspace.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
