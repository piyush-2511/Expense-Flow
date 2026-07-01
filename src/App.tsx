import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { restoreSession, setSession } from './Features/auth/authSlice'
import { authService } from './supabase/authService'
import { useAuth } from './Hooks/useAuth'
import AuthPage from './Components/AuthPage'
import ProtectedRoute from './Components/ProtectedRoute'
import AppLayout from './Components/AppLayout'
import ExpensesPage from './Features/expense/ExpensesPage'
import DashboardPage from './Features/Dashboard/DashboardPage'
import AddTagsPage from './Features/expense/AddTagPage'
import MonthlyAnalysisPage from './Features/Dashboard/MonthlyAnalysisPage'

export default function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(session => {
      dispatch(setSession(session))
    })
    return unsubscribe
  }, [dispatch])

  if (isLoading) return null

  return (
    <BrowserRouter>
      <Routes>

        {/* Public route — redirect to dashboard if already logged in */}
        <Route
          path="/auth"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <AuthPage />
          }
        />

        {/* Protected routes — all share AppLayout (header + outlet) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"  element={<DashboardPage />} />
          <Route path="/expenses"   element={<ExpensesPage />} />
          <Route path="/tags"       element={<AddTagsPage />} />
          <Route path="/analysis"   element={<MonthlyAnalysisPage />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}