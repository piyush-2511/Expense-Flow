import { useMonthlyOverview } from './dashboardQueries'

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const formatMonthLabel = (monthStart: string) =>
  new Date(monthStart).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

const isCurrentMonth = (monthStart: string) => {
  const now = new Date()
  const d = new Date(monthStart)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

interface MonthsListPageProps {
  onSelectMonth: (monthStart: string) => void
}

export default function MonthsListPage({ onSelectMonth }: MonthsListPageProps) {
  const { data: months = [], isLoading } = useMonthlyOverview()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Monthly Analysis
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Select a month to view detailed spending breakdown
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          Loading months…
        </div>
      ) : months.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          <p className="text-3xl mb-3">📊</p>
          No expense history yet — add some expenses to see monthly analysis
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {months.map(m => (
            <button
              key={m.month_start}
              onClick={() => onSelectMonth(m.month_start)}
              className="flex items-center justify-between bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 text-left hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase leading-none">
                    {new Date(m.month_start).toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-none mt-0.5">
                    {new Date(m.month_start).getFullYear()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMonthLabel(m.month_start)}
                    </p>
                    {isCurrentMonth(m.month_start) && (
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {m.expense_count} expense{m.expense_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {formatCurrency(Number(m.total))}
                </span>
                <span className="text-gray-300 dark:text-gray-600 text-sm">→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}