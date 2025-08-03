// USER MANAGEMENT AND FIXES

import { supabase } from '@/lib/supabaseClient'
import { User } from '@/types/database'

// Ensure user exists in our database
export async function ensureUserExists(): Promise<User | null> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      console.log('No authenticated user')
      return null
    }

    console.log('Auth user:', authUser.id, authUser.email)

    // Check if user exists in our database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (existingUser && !fetchError) {
      console.log('User exists in database:', existingUser.id)
      return existingUser
    }

    console.log('User not found in database, creating...', fetchError?.message)

    // Create user if doesn't exist
    const userData = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown User',
      email: authUser.email!,
      handle: null, // Will be set later if needed
      bio: null,
      website: null,
      github: null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      is_public: true,
      settings: {}
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return null
    }

    console.log('User created successfully:', newUser.id)
    return newUser
  } catch (error: any) {
    console.error('Error in ensureUserExists:', error)
    return null
  }
}

// Debug function to check database connection
export async function debugDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    console.log('Database connection test:', { success: !testError, error: testError?.message })

    // Check auth user
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current auth user:', user?.id, user?.email)

    if (user) {
      // Check if user exists in database
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('User in database:', { exists: !!dbUser, error: userError?.message })

      // Check projects
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user.id)
        .limit(5)

      console.log('User projects:', { count: projects?.length || 0, error: projectError?.message })
    }

  } catch (error: any) {
    console.error('Debug error:', error)
  }
}
