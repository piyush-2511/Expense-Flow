// ================================================================
// Placeholder pages for Phase 3 routing verification.
// Real implementations:
//   DashboardPage    → Phase 5
//   ExpensesPage      → Phase 4
//   EnterExpensePage → Phase 4
// ================================================================

export function DashboardPage() {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Dashboard
      </h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        Pie chart, digital clock, and calendar heatmap go here — built in Phase 5.
      </p>
    </div>
  )
}

export function ExpensesPage() {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        My Daily Expenses
      </h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        Expense list, search by tag, filters go here — built in Phase 4.
      </p>
    </div>
  )
}

export function EnterExpensePage() {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Enter Expense
      </h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        Add expense form/dialog goes here — built in Phase 4.
      </p>
    </div>
  )
}