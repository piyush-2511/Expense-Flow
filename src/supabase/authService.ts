import { supabase } from './client'
import type { User, Session } from '@supabase/supabase-js'

export interface SignUpParams {
  email: string
  password: string
  username: string
}

export interface SignInParams {
  email: string
  password: string
}

export const authService = {

  // ── Sign up — creates auth.users row, triggers profile creation ──
  // username is stored in metadata, read by the DB trigger
  // (handle_new_user) to populate the profiles table automatically
  signUp: async ({ email, password, username }: SignUpParams) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // ← read by Supabase trigger on signup
      },
    })
    if (error) throw error
    return data
  },

  // ── Sign in with email + password ──
  signIn: async ({ email, password }: SignInParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // ── Sign out — clears Supabase session ──
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // ── Get current session — used on app load to check if already logged in ──
  getSession: async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  // ── Get current user ──
  getUser: async (): Promise<User | null> => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  // ── Subscribe to auth state changes (login, logout, token refresh) ──
  // Returns an unsubscribe function — call it on cleanup
  onAuthStateChange: (callback: (session: Session | null) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
    return () => data.subscription.unsubscribe()
  },

}