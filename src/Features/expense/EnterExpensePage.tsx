import { useNavigate } from 'react-router-dom'
import ExpenseDialog from './ExpenseDialog'

// ================================================================
// EnterExpensePage.tsx
//
// A dedicated route for "Enter Expense" in the header nav.
// Opens ExpenseDialog immediately; closing it navigates back
// to the expenses list.
// ================================================================

export default function EnterExpensePage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
        Enter Expense
      </h1>
      <ExpenseDialog
        isOpen={true}
        onClose={() => navigate('/expenses')}
      />
    </div>
  )
}