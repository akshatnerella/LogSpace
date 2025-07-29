'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Menu, X, Settings, LogOut } from 'lucide-react'
import { Button } from './Button'
import { SignInModal } from './auth/SignInModal'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' }
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const { user, signOut, loading } = useAuth()
  
  const isSignedIn = !!user

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <>
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? "/home" : "/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="LogSpace" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">LogSpace</span>
          </Link>

          {/* Desktop Navigation - only show on larger screens */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-foreground transition-colors font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA - adjusted for better spacing */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <img
                    src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
                    alt={user?.user_metadata?.full_name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50">
                    <Link
                      href="/home"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-hover transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Home</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-hover transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button onClick={() => setShowSignInModal(true)} variant="ghost" className="text-sm px-3">
                  Sign in
                </Button>
                <Button href="/create-project" className="text-sm px-4">
                  Start Building
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button - show on tablet and mobile */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-foreground flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu - improved mobile/tablet experience */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border bg-background">
              <Link href={user ? "/home" : "/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/logo.png" alt="LogSpace" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold text-foreground">LogSpace</span>
              </Link>
              <button
                className="p-2 text-text-secondary hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Mobile menu content */}
            <div className="px-4 sm:px-6 py-6 space-y-6 bg-background min-h-screen">
              {/* Navigation Links */}
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-lg font-medium text-foreground hover:text-primary transition-colors py-3 border-b border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile CTA Buttons */}
              <div className="space-y-3 pt-6">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/home"
                      className="flex items-center justify-center py-3 text-base font-medium text-foreground border border-border rounded-lg hover:bg-surface transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center py-3 text-base font-medium text-text-secondary hover:text-foreground transition-colors border border-border rounded-lg hover:bg-surface w-full"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowSignInModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center py-3 text-base font-medium text-text-secondary hover:text-foreground transition-colors border border-border rounded-lg hover:bg-surface w-full"
                    >
                      Sign in
                    </button>
                    <Button href="/create-project" className="w-full py-3 text-base" size="lg">
                      Start Building
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
    </nav>
    
    {/* Sign In Modal - Moved outside nav for proper viewport positioning */}
    <SignInModal 
      isOpen={showSignInModal} 
      onClose={() => setShowSignInModal(false)} 
    />
    </>
  )
}
