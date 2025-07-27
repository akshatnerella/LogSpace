'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  
  const isSignedIn = status === 'authenticated'
  const user = session?.user

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-foreground">LogSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <img
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {user?.name || user?.email || 'User'}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-hover transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
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
                <Button onClick={() => setShowSignInModal(true)} variant="ghost">
                  Sign in
                </Button>
                <Button href="/create-project">
                  Start Building
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-bold text-foreground">LogSpace</span>
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
            <div className="px-6 py-8 space-y-8">
              {/* Navigation Links */}
              <div className="space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-xl font-medium text-foreground hover:text-primary transition-colors min-h-[44px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile CTA Buttons */}
              <div className="space-y-4 pt-8 border-t border-border">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center py-4 text-lg font-medium text-foreground border border-border rounded-xl min-h-[44px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center py-4 text-lg font-medium text-text-secondary hover:text-foreground transition-colors border border-border rounded-xl min-h-[44px] w-full"
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
                      className="flex items-center justify-center py-4 text-lg font-medium text-text-secondary hover:text-foreground transition-colors border border-border rounded-xl min-h-[44px] w-full"
                    >
                      Sign in
                    </button>
                    <Button href="/create-project" className="w-full min-h-[44px] text-lg" size="lg">
                      Start Building
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </nav>
  )
}
