'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User, Session } from '@supabase/supabase-js'
import { ensureUserExists } from '@/lib/userManagement'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      
      // Create user in database if they're already authenticated
      if (session?.user) {
        try {
          console.log('Creating user in database from initial session...')
          await ensureUserExists()
          console.log('User created/updated in database successfully')
        } catch (error) {
          console.error('Error creating user in database from initial session:', error)
        }
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      
      // Create user in database when they sign in
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log('Creating user in database after sign in...')
          await ensureUserExists()
          console.log('User created/updated in database successfully')
        } catch (error) {
          console.error('Error creating user in database:', error)
        }
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    })
    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
