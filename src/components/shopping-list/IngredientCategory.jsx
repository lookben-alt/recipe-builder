import IngredientItem from './IngredientItem'

const CATEGORY_ICONS = {
  Produce: '🥬',
  Meat: '🥩',
  Seafood: '🐟',
  Dairy: '🥛',
  Pantry: '🥫',
  Other: '📦'
}

export default function IngredientCategory({ category, items, checkedItems, onToggle }) {
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {category}
      </h3>
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50 px-3">
        {items.map(item => (
          <IngredientItem
            key={item.id}
            item={item}
            isChecked={checkedItems.includes(item.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
