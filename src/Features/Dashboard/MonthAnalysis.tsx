import { useMemo } from 'react'
import {
  useMonthlyDailyTotals,
  useMonthlyTagTotals,
  useMonthlySummary,
} from './dashboardQueries'

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const formatMonthLabel = (monthStart: string) =>
  new Date(monthStart).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

interface MonthAnalysisDetailProps {
  monthStart: string
  onBack: () => void
}

export default function MonthAnalysisDetail({ monthStart, onBack }: MonthAnalysisDetailProps) {
  const { data: dailyTotals = [], isLoading: loadingDaily } = useMonthlyDailyTotals(monthStart)
  const { data: tagTotals = [], isLoading: loadingTags } = useMonthlyTagTotals(monthStart)
  const { data: summary, isLoading: loadingSummary } = useMonthlySummary(monthStart)

  const isLoading = loadingDaily || loadingTags || loadingSummary

  const maxDayTotal = useMemo(
    () => Math.max(...dailyTotals.map(d => d.total), 1),
    [dailyTotals]
  )

  const maxTagTotal = useMemo(
    () => Math.max(...tagTotals.map(t => t.total), 1),
    [tagTotals]
  )

  const hasAnySpend = dailyTotals.some(d => d.total > 0)

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          ← Back
        </button>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {formatMonthLabel(monthStart)}
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          Loading analysis…
        </div>
      ) : !hasAnySpend ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          <p className="text-3xl mb-3">💸</p>
          No expenses recorded for this month
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryCard
              label="Total spent"
              value={formatCurrency(summary?.total_spent ?? 0)}
              accent="blue"
            />
            <SummaryCard
              label="Avg / day"
              value={formatCurrency(summary?.avg_daily_spend ?? 0)}
              accent="default"
            />
            <SummaryCard
              label="Highest expense"
              value={formatCurrency(summary?.highest_expense ?? 0)}
              accent="default"
            />
            <SummaryCard
              label="No. of expenses"
              value={String(summary?.expense_count ?? 0)}
              accent="default"
            />
          </div>

          {/* Highest spend day banner */}
          {summary?.highest_spend_day && (
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 mb-6">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide">
                  Highest spending day
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                  {new Date(summary.highest_spend_day).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  — {formatCurrency(summary.highest_day_total)}
                </p>
              </div>
            </div>
          )}

          {/* Most used tag */}
          {summary?.most_used_tag && (
            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 rounded-xl px-4 py-3 mb-8">
              <span className="text-xl">🏷️</span>
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
                  Most used tag
                </p>
                <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                  {summary.most_used_tag}
                </p>
              </div>
            </div>
          )}

          {/* Daily spend bar chart */}
          <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Daily spend
            </h2>
            <div className="flex items-end gap-[3px] h-36 overflow-x-auto pb-1">
              {dailyTotals.map(d => {
                const heightPct = (d.total / maxDayTotal) * 100
                const isHighest = d.total > 0 && d.total === maxDayTotal
                const dayNum = new Date(d.day).getDate()
                return (
                  <div
                    key={d.day}
                    className="flex flex-col items-center justify-end h-full flex-1 min-w-[8px] group"
                  >
                    {/* Tooltip on hover */}
                    {d.total > 0 && (
                      <span className="hidden group-hover:block text-[9px] text-gray-500 dark:text-gray-400 mb-0.5 whitespace-nowrap">
                        {formatCurrency(d.total)}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        isHighest
                          ? 'bg-blue-600'
                          : d.total > 0
                          ? 'bg-blue-300 dark:bg-blue-700 group-hover:bg-blue-400 dark:group-hover:bg-blue-600'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                      style={{ height: `${Math.max(heightPct, 2)}%` }}
                      title={`${dayNum}: ${formatCurrency(d.total)}`}
                    />
                    {/* Show day number only on 1st, 8th, 15th, 22nd, 29th to avoid crowding */}
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">
                      {[1, 8, 15, 22, 29].includes(dayNum) ? dayNum : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tag breakdown */}
          <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Spend by tag
            </h2>
            {tagTotals.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-600 py-4 text-center">
                No tagged expenses this month
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {tagTotals.map(t => {
                  const pct = Math.round((t.total / (summary?.total_spent ?? 1)) * 100)
                  return (
                    <div key={t.tag_name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t.tag_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {pct}%
                          </span>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-20 text-right">
                            {formatCurrency(Number(t.total))}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all"
                          style={{ width: `${(t.total / maxTagTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'blue' | 'default'
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 border ${
        accent === 'blue'
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'
      }`}
    >
      <p
        className={`text-xs mb-1 ${
          accent === 'blue' ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {label}
      </p>
      <p
        className={`text-base font-bold truncate ${
          accent === 'blue' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        {value}
      </p>
    </div>
  )
}