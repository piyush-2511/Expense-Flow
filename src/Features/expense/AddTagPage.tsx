import { useState } from 'react'
import { useTagDefinitions, useAddTagDefinition, useDeleteTagDefinition, useUpdateTagDefinition } from './tagQueries'
import type { TagDefinition } from '../../supabase/tagDefinitionService'

// ================================================================
// AddTagsPage.tsx
//
// Page where users manage their master tag list.
// Linked from Header as "Add Tags".
// Tags created here appear in the TagPicker inside ExpenseDialog.
// ================================================================

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

export default function AddTagsPage() {
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[5]) // blue default
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const { data: tags = [], isLoading } = useTagDefinitions()
  const addTag = useAddTagDefinition()
  const deleteTag = useDeleteTagDefinition()
  const updateTag = useUpdateTagDefinition()

  // ── Add ──
  const handleAdd = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Tag name cannot be empty')
      return
    }
    if (tags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A tag with this name already exists')
      return
    }

    setError('')
    try {
      await addTag.mutateAsync({ name: trimmed, color })
      setName('')
    } catch {
      setError('Failed to add tag — please try again')
    }
  }

  // ── Edit inline ──
  const startEditing = (tag: TagDefinition) => {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color ?? PRESET_COLORS[5])
  }

  const handleUpdate = async (tag: TagDefinition) => {
    const trimmed = editName.trim()
    if (!trimmed) return

    const isDuplicate = tags.some(
      t => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== tag.id
    )
    if (isDuplicate) {
      setError('Another tag with this name already exists')
      return
    }

    await updateTag.mutateAsync({
      id: tag.id,
      updates: { name: trimmed, color: editColor },
    })
    setEditingId(null)
  }

  const cancelEditing = () => setEditingId(null)

  // ── Delete ──
  const handleDelete = async (id: string) => {
    await deleteTag.mutateAsync(id)
    if (editingId === id) setEditingId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
        Add Tags
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
        Define your tag list here. These appear as selectable chips when you add or edit an expense.
      </p>

      {/* ── New tag form ── */}
      <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-8">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          New tag
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            placeholder="e.g. Groceries, Fuel, Rent…"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 px-3 py-2.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={addTag.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-[0.98] whitespace-nowrap"
          >
            {addTag.isPending ? 'Adding…' : '+ Add tag'}
          </button>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Color</span>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-all ${
                color === c
                  ? 'ring-2 ring-offset-2 ring-gray-500 dark:ring-offset-gray-900 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>

        {/* Preview */}
        {name.trim() && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Preview:</span>
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm text-white font-medium"
              style={{ backgroundColor: color }}
            >
              <span className="w-2 h-2 rounded-full bg-white/60" />
              {name.trim()}
            </span>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* ── Existing tags list ── */}
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        Your tags ({tags.length})
      </p>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          Loading tags…
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
          <p className="text-3xl mb-3">🏷️</p>
          No tags yet — add your first one above
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center gap-3 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
            >
              {editingId === tag.id ? (
                // ── Inline edit mode ──
                <>
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleUpdate(tag)}
                      className="flex-1 min-w-[120px] bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                    />
                    <div className="flex items-center gap-1.5">
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full transition-all ${
                            editColor === c
                              ? 'ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-900 scale-110'
                              : ''
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdate(tag)}
                    disabled={updateTag.isPending}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 px-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                // ── View mode ──
                <>
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color ?? '#9ca3af' }}
                  />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {tag.name}
                  </span>
                  <button
                    onClick={() => startEditing(tag)}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
                    aria-label={`Edit tag ${tag.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    disabled={deleteTag.isPending}
                    className="text-xs text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 px-1"
                    aria-label={`Delete tag ${tag.name}`}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}