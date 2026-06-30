import { useAppDispatch, useAppSelector } from '../store/hooks'
import { signInUser, signUpUser, signOutUser, clearError } from '../Features/auth/authSlice'
import type { SignInParams, SignUpParams } from '../supabase/authService'


export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector(state => state.auth.user)
  const session = useAppSelector(state => state.auth.session)
  const status = useAppSelector(state => state.auth.status)
  const error = useAppSelector(state => state.auth.error)

  const isAuthenticated = Boolean(session)
  const isLoading = status === 'loading'

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signIn: (params: SignInParams) => dispatch(signInUser(params)),
    signUp: (params: SignUpParams) => dispatch(signUpUser(params)),
    signOut: () => dispatch(signOutUser()),
    clearError: () => dispatch(clearError()),
  }
}