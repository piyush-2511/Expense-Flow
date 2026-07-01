import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTagTotals } from './dashboardQueries'

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function PieChart() {
  const { data: tagTotals, isLoading } = useTagTotals()

  const chartData = (tagTotals ?? []).map(t => ({
    name: t.tag_name,
    value: t.total,
  }))

  const hasData = chartData.length > 0

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        Spending by tag
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Breakdown of all your expenses
      </p>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          Loading…
        </div>
      ) : !hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center">
          <p className="text-3xl mb-2">🏷️</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add tagged expenses to see your breakdown
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <RePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </RePieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}