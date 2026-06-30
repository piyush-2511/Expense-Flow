import { Navigate } from 'react-router-dom'
import { useAuth } from '../Hooks/useAuth'

interface Props {
  children: React.ReactNode
}

// ================================================================
// ProtectedRoute.tsx
//
// Wraps any page that requires a logged-in user.
// If no session exists, redirects to /auth.
// While the session is still being restored on app load, shows
// a loading state instead of flashing the login page.
// ================================================================

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}