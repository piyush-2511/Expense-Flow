import { useState, useMemo } from 'react'
import { useExpenses } from './expenseQueries'
import ExpenseItem from './ExpenseItem'
import ExpenseDialog from './ExpenseDialog'
import type { Expense } from '../../supabase/ExpenseService'

export default function ExpensesPage() {
  const [searchTag, setSearchTag] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const allExpenses = useExpenses()
  const expensesData = allExpenses.data ?? []

  // ── Combined filter: tag + date range, each optional ──
  const filteredExpenses = useMemo(() => {
    const tag = searchTag.trim().toLowerCase()

    return expensesData.filter(expense => {
      const matchesTag = tag === '' || expense.tags.some(t => t.toLowerCase().includes(tag))
      const matchesFrom = dateFrom === '' || expense.date >= dateFrom
      const matchesTo = dateTo === '' || expense.date <= dateTo
      return matchesTag && matchesFrom && matchesTo
    })
  }, [expensesData, searchTag, dateFrom, dateTo])

  const isFiltering = searchTag.trim() !== '' || dateFrom !== '' || dateTo !== ''

  // ── Group filtered expenses by date, newest first ──
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Expense[]> = {}
    for (const expense of filteredExpenses) {
      if (!groups[expense.date]) groups[expense.date] = []
      groups[expense.date].push(expense)
    }
    return Object.entries(groups).sort(([dateA], [dateB]) => (dateA < dateB ? 1 : -1))
  }, [filteredExpenses])

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingExpense(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingExpense(null)
  }

  const handleClearFilters = () => {
    setSearchTag('')
    setDateFrom('')
    setDateTo('')
  }

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

    if (isSameDay(date, today)) return 'Today'
    if (isSameDay(date, yesterday)) return 'Yesterday'

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            My Daily Expenses
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} · Total{' '}
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total)}
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
        >
          + Add expense
        </button>
      </div>

      {/* Search by tag */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search by tag (e.g. Food, Travel)…"
          value={searchTag}
          onChange={e => setSearchTag(e.target.value)}
          className="w-full bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
        />
        {searchTag && (
          <button
            onClick={() => setSearchTag('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter by date range — added at the end, combines with tag search above */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
          />
          <span className="text-gray-400 dark:text-gray-500 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
          />
        </div>

        {isFiltering && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 whitespace-nowrap self-start sm:self-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* List, grouped by date */}
      {allExpenses.isLoading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          Loading expenses…
        </div>
      ) : groupedByDate.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          <p className="text-3xl mb-3">💸</p>
          {isFiltering ? 'No expenses matched' : 'No expenses yet — add your first one above'}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedByDate.map(([date, expensesForDate]) => {
            const dayTotal = expensesForDate.reduce((sum, e) => sum + e.amount, 0)
            return (
              <div key={date}>
                <div className="flex items-baseline justify-between mb-2 px-1">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {formatDateHeader(date)}
                  </h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(dayTotal)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {expensesForDate.map(expense => (
                    <ExpenseItem key={expense.id} expense={expense} onEdit={handleEdit} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ExpenseDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingExpense={editingExpense}
      />
    </div>
  )
}