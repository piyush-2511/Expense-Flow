import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '../../supabase/authService'
import type { SignUpParams, SignInParams } from '../../supabase/authService'

// ================================================================
// authSlice.ts
//
// Wraps authService functions in createAsyncThunk so Redux can
// track loading/error/success state automatically for each call.
//
// This slice owns: session, user, loading, error
// It does NOT own: form input values (those are local useState
// in AuthPage.tsx)
// ================================================================

interface AuthState {
  user: User | null
  session: Session | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  session: null,
  status: 'idle',
  error: null,
}

// ── Async Thunks ─────────────────────────────────────────────
// Each thunk calls one authService function and lets Redux Toolkit
// auto-generate pending/fulfilled/rejected action types

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (params: SignUpParams, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Sign up failed'
      )
    }
  }
)

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (params: SignInParams, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Sign in failed'
      )
    }
  }
)

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut()
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Sign out failed'
      )
    }
  }
)

// Checks for an existing session on app load (e.g. page refresh)
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await authService.getSession()
      return session
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to restore session'
      )
    }
  }
)

// ── Slice ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called by the onAuthStateChange listener (set up in App.tsx)
    // Keeps Redux in sync with Supabase's own session changes
    // (e.g. token refresh, logout from another tab)
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
      state.user = action.payload?.user ?? null
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder

      // ── Sign Up ──
      .addCase(signUpUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.session = action.payload.session
        state.user = action.payload.user
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // ── Sign In ──
      .addCase(signInUser.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.session = action.payload.session
        state.user = action.payload.user
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // ── Sign Out ──
      .addCase(signOutUser.fulfilled, state => {
        state.status = 'idle'
        state.session = null
        state.user = null
      })

      // ── Restore Session (on app load) ──
      .addCase(restoreSession.pending, state => {
        state.status = 'loading'
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.session = action.payload
        state.user = action.payload?.user ?? null
      })
      .addCase(restoreSession.rejected, state => {
        state.status = 'failed'
        state.session = null
        state.user = null
      })
  },
})

export const { setSession, clearError } = authSlice.actions
export default authSlice.reducer