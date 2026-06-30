import { useState } from 'react'
import { useExpenses, useExpensesByTag } from './expenseQueries'
import ExpenseItem from './ExpenseItem'
import ExpenseDialog from './ExpenseDialog'
import type { Expense } from '../../supabase/ExpenseService'

export default function ExpensesPage() {
  const [searchTag, setSearchTag] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const allExpenses = useExpenses()
  const searchedExpenses = useExpensesByTag(searchTag)

  const isSearching = searchTag.trim().length > 0
  const activeQuery = isSearching ? searchedExpenses : allExpenses

  const expenses = activeQuery.data ?? []

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

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            My Daily Expenses
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} · Total{' '}
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
      <div className="relative mb-5">
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

      {/* List */}
      {activeQuery.isLoading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          Loading expenses…
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          <p className="text-3xl mb-3">💸</p>
          {isSearching
            ? `No expenses tagged "${searchTag}"`
            : 'No expenses yet — add your first one above'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {expenses.map(expense => (
            <ExpenseItem key={expense.id} expense={expense} onEdit={handleEdit} />
          ))}
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