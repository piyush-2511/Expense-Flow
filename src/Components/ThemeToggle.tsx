type Props = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="
        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        bg-gray-50 dark:bg-gray-700/60
        border border-gray-200 dark:border-gray-600
        text-gray-500 dark:text-gray-400
        hover:text-gray-900 dark:hover:text-white
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-all duration-200 active:scale-95
      "
    >
      {theme === 'light' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}