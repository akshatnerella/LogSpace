import { supabase } from '@/lib/supabaseClient'

// PROJECT VISIBILITY TOGGLE
export async function toggleProjectVisibility(projectId: string, visibility: 'public' | 'private'): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('No user found')
      return false
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ visibility })
      .eq('id', projectId)
      .eq('created_by', user.id) // Only owner can change visibility
      .select()

    if (error) {
      console.error('Error updating project visibility:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in toggleProjectVisibility:', error)
    return false
  }
}
