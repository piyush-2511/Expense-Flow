import { useState } from 'react'
import { useAuth } from '../Hooks/useAuth'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const { signIn, signUp, isLoading, error, clearError } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const switchMode = (next: Mode) => {
    setMode(next)
    clearError()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup') {
      signUp({ email, password, username })
    } else {
      signIn({ email, password })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            ExpenseFlow
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">

          {/* Mode toggle */}
          <div className="flex bg-gray-50 dark:bg-gray-900/50 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />

            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] mt-1"
            >
              {isLoading
                ? 'Please wait…'
                : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}