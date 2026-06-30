import { useState } from 'react'
import { useAuth } from '../../Hooks/useAuth'
import { useAddExpense, useUpdateExpense } from './expenseQueries'
import type { Expense } from '../../supabase/ExpenseService'

interface Props {
  isOpen: boolean
  onClose: () => void
  editingExpense?: Expense | null   // pass an expense to edit, omit to add new
}

const todayISO = () => new Date().toISOString().split('T')[0]

export default function ExpenseDialog({ isOpen, onClose, editingExpense }: Props) {
  const { user } = useAuth()
  const addExpense = useAddExpense()
  const updateExpense = useUpdateExpense()

  const isEditMode = Boolean(editingExpense)

  const [amount, setAmount] = useState(editingExpense?.amount.toString() ?? '')
  const [description, setDescription] = useState(editingExpense?.description ?? '')
  const [date, setDate] = useState(editingExpense?.date ?? todayISO())
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(editingExpense?.tags ?? [])
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (tags.includes(trimmed)) {
      setTagInput('')
      return
    }
    setTags(prev => [...prev, trimmed])
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const resetForm = () => {
    setAmount('')
    setDescription('')
    setDate(todayISO())
    setTags([])
    setTagInput('')
    setFormError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Enter a valid amount greater than 0')
      return
    }
    if (!description.trim()) {
      setFormError('Enter a description')
      return
    }

    console.log(user.id)
    if (!user) return

    try {
      if (isEditMode && editingExpense) {
        await updateExpense.mutateAsync({
          id: editingExpense.id,
          amount: numericAmount,
          description: description.trim(),
          date,
          tags,
          userId: user.id,
        })
      } else {
        await addExpense.mutateAsync({
          userId: user.id,
          amount: numericAmount,
          description: description.trim(),
          date,
          tags,
        })
      }
      handleClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const isSubmitting = addExpense.isPending || updateExpense.isPending

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit expense' : 'New expense'}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 block">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 block">
              Description
            </label>
            <input
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 block">
              Tags
            </label>
            <input
              type="text"
              placeholder="Food, Travel, Vegetables… (Enter to add)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 px-4 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                      className="hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {formError && (
            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] mt-1"
          >
            {isSubmitting
              ? 'Saving…'
              : isEditMode
              ? 'Save changes'
              : 'Add expense'}
          </button>
        </form>
      </div>
    </div>
  )
}