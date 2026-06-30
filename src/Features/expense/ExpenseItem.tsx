import { useState } from 'react'
import type { Expense } from '../../supabase/ExpenseService'
import { useDeleteExpense } from './expenseQueries'

interface Props {
  expense: Expense
  onEdit: (expense: Expense) => void
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

export default function ExpenseItem({ expense, onEdit }: Props) {
  const deleteExpense = useDeleteExpense()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    deleteExpense.mutate(expense.id)
    setShowConfirm(false)
  }

  return (
    <div className="group bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {expense.description}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(expense.date)}
            </span>
          </div>

          {expense.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {expense.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {formatAmount(expense.amount)}
          </p>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              aria-label="Edit expense"
              className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-400 hover:text-blue-500 flex items-center justify-center text-xs transition-all"
            >
              ✏️
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              aria-label="Delete expense"
              className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 flex items-center justify-center text-xs transition-all"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-red-500 dark:text-red-400 font-medium">
            Delete this expense?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs font-medium px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="text-xs font-bold px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}