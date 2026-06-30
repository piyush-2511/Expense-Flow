import { NavLink } from 'react-router-dom'
import { useAuth } from '../Hooks/useAuth'
import { useTheme } from '../Hooks/useTheme'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'My Expenses' },
  // { to: '/expenses/new', label: 'Enter Expense' },
]

export default function Headers() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            ExpenseFlow
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: username + theme toggle + sign out */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden md:inline text-xs text-gray-400 dark:text-gray-500 mr-1">
            {user?.email}
          </span>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <button
            onClick={() => signOut()}
            className="text-xs font-semibold text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-gray-50 dark:bg-gray-700/60 hover:bg-red-50 dark:hover:bg-red-950/40 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 px-3 py-2 rounded-xl transition-all"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile nav — shown below header on small screens */}
      <nav className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}