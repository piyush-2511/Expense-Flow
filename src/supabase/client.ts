import { createClient } from '@supabase/supabase-js'
import { config } from '../config/config'

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: true,      // keeps user logged in across refresh
    autoRefreshToken: true,    // refreshes expired tokens automatically
    detectSessionInUrl: true,  // needed for email confirmation links
  },
})