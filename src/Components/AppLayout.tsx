import { Outlet } from 'react-router-dom'
import Header from './Headers'

// ================================================================
// AppLayout.tsx
//
// Wraps every protected page with the Header.
// <Outlet /> renders whichever child route matched
// (DashboardPage, ExpensesPage, etc.)
// ================================================================

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}