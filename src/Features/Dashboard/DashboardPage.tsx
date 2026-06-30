import { useMemo } from 'react'
import { useAuth } from '../../Hooks/useAuth'
import { useTagTotals, useDailyTotals } from './dashboardQueries'
import DigitalClock from './DigitalClock'
import PieChart from './PieChart'
import CalendarHeatmap from './CalendarHeatmap'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: tagTotals } = useTagTotals()
  const { data: dailyTotals } = useDailyTotals()

  const stats = useMemo(() => {
    const tags = tagTotals ?? []
    const days = dailyTotals ?? []

    const totalSpent = days.reduce((sum, d) => sum + d.total, 0)

    const topTag = tags.length > 0
      ? tags.reduce((max, t) => (t.total > max.total ? t : max))
      : null

    const highestDay = days.length > 0
      ? days.reduce((max, d) => (d.total > max.total ? d : max))
      : null

    return { totalSpent, topTag, highestDay }
  }, [tagTotals, dailyTotals])

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back{user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ''}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Here's an overview of your spending
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Total spent
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {formatCurrency(stats.totalSpent)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Top tag
          </p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
            {stats.topTag ? stats.topTag.tag_name : '—'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Highest spend day
          </p>
          <p className="text-xl font-bold text-red-500 dark:text-red-400 mt-1">
            {stats.highestDay ? formatCurrency(stats.highestDay.total) : '—'}
          </p>
        </div>
      </div>

      {/* Clock */}
      <div className="mb-5">
        <DigitalClock />
      </div>

      {/* Pie chart + Calendar heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PieChart />
        <CalendarHeatmap />
      </div>
    </div>
  )
}