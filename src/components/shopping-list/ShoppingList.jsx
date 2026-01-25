import { useMemo } from 'react'
import IngredientCategory from './IngredientCategory'
import ExportOptions from './ExportOptions'
import { EmptyState } from '../ui'

export default function ShoppingList({
  items,
  checkedItems,
  onToggle,
  onClearChecked,
  getExportText,
  getUncheckedText
}) {
  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {}
    items.forEach(item => {
      const category = item.category || 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })
    return groups
  }, [items])

  const handleCopy = async () => {
    const text = getUncheckedText()
    await navigator.clipboard.writeText(text)
  }

  const handleShare = async () => {
    const text = getUncheckedText()
    try {
      await navigator.share({
        title: 'Shopping List',
        text: text
      })
    } catch (err) {
      // User cancelled or share failed
      console.log('Share cancelled')
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        title="No shopping list yet"
        description="Add recipes to your weekly plan and generate a shopping list."
      />
    )
  }

  const categories = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Pantry', 'Other']
  const totalItems = items.length
  const checkedCount = checkedItems.length

  return (
    <div>
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Shopping List
        </h2>
        <span className="text-sm text-gray-500">
          {checkedCount} / {totalItems} items
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(checkedCount / totalItems) * 100}%` }}
        />
      </div>

      {/* Export options */}
      <div className="mb-4">
        <ExportOptions
          onCopy={handleCopy}
          onShare={handleShare}
          onClearChecked={onClearChecked}
          hasChecked={checkedCount > 0}
        />
      </div>

      {/* Categories */}
      {categories.map(category => {
        const categoryItems = groupedItems[category]
        if (!categoryItems || categoryItems.length === 0) return null

        return (
          <IngredientCategory
            key={category}
            category={category}
            items={categoryItems}
            checkedItems={checkedItems}
            onToggle={onToggle}
          />
        )
      })}
    </div>
  )
}
