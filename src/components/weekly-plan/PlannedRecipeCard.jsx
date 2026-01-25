export default function PlannedRecipeCard({ recipe, onRemove }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex gap-3">
      {/* Thumbnail or placeholder */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex-shrink-0 flex items-center justify-center">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{recipe.name}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {totalTime} min
            </span>
          )}
          {recipe.servings > 0 && (
            <span>{recipe.servings} servings</span>
          )}
        </div>
        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(recipe.id)}
        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors self-start"
        aria-label="Remove from plan"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
