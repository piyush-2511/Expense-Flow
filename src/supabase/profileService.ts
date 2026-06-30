import { supabase } from './client'

export interface Profile {
  id: string
  username: string
  email: string
  created_at: string
}

export const profileService = {
  getProfile: async (userId: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as Profile
  },
}