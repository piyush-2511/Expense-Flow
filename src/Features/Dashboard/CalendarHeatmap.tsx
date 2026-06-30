import { useMemo, useState } from 'react'
import { useDailyTotals } from './dashboardQueries'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

// Returns a Tailwind color class based on spend relative to the month's max
function getIntensityClass(amount: number, max: number): string {
  if (amount === 0) return 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
  const ratio = amount / max
  if (ratio >= 0.75) return 'bg-red-400 dark:bg-red-500 text-white'
  if (ratio >= 0.4) return 'bg-amber-300 dark:bg-amber-500 text-amber-900 dark:text-white'
  return 'bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-white'
}

export default function CalendarHeatmap() {
  const { data: dailyTotals, isLoading } = useDailyTotals()
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Map date string → total amount, for fast lookup while rendering days
  const totalsByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of dailyTotals ?? []) {
      map.set(entry.date, entry.total)
    }
    return map
  }, [dailyTotals])

  const maxSpend = useMemo(() => {
    const values = Array.from(totalsByDate.values())
    return values.length > 0 ? Math.max(...values) : 1
  }, [totalsByDate])

  // Build the grid: leading blanks + all days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0 = Sunday
  const blanks = Array.from({ length: firstDayOfWeek })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const dateKey = (day: number) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">

      {/* Header with month nav */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Spending calendar
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{monthLabel}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs transition"
          >
            ‹
          </button>
          <button
            onClick={goToNextMonth}
            aria-label="Next month"
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs transition"
          >
            ›
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          Loading…
        </div>
      ) : (
        <>
          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {days.map(day => {
              const key = dateKey(day)
              const amount = totalsByDate.get(key) ?? 0
              const colorClass = getIntensityClass(amount, maxSpend)

              return (
                <div
                  key={day}
                  title={amount > 0 ? formatCurrency(amount) : 'No expenses'}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[11px] font-semibold ${colorClass} transition-colors`}
                >
                  {day}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <LegendDot colorClass="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600" label="None" />
            <LegendDot colorClass="bg-emerald-200 dark:bg-emerald-700" label="Low" />
            <LegendDot colorClass="bg-amber-300 dark:bg-amber-500" label="Medium" />
            <LegendDot colorClass="bg-red-400 dark:bg-red-500" label="High" />
          </div>
        </>
      )}
    </div>
  )
}

function LegendDot({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded ${colorClass}`} />
      <span className="text-[11px] text-gray-400 dark:text-gray-500">{label}</span>
    </div>
  )
}