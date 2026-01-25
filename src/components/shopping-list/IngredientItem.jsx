export default function IngredientItem({ item, isChecked, onToggle }) {
  const formatQuantity = (qty) => {
    if (!qty) return ''
    // Handle decimals nicely
    if (qty === Math.floor(qty)) return qty.toString()
    // Common fractions
    if (Math.abs(qty - 0.5) < 0.01) return '1/2'
    if (Math.abs(qty - 0.25) < 0.01) return '1/4'
    if (Math.abs(qty - 0.75) < 0.01) return '3/4'
    if (Math.abs(qty - 0.33) < 0.01) return '1/3'
    if (Math.abs(qty - 0.67) < 0.01) return '2/3'
    return qty.toFixed(1)
  }

  const quantityStr = formatQuantity(item.quantity)
  const unitStr = item.unit || ''
  const displayText = [quantityStr, unitStr, item.ingredient]
    .filter(Boolean)
    .join(' ')

  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggle(item.id)}
        className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
      />
      <div className="flex-1">
        <span className={`${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {displayText}
        </span>
        {item.recipes?.length > 1 && (
          <span className="block text-xs text-gray-400 mt-0.5">
            For: {item.recipes.join(', ')}
          </span>
        )}
      </div>
    </label>
  )
}
