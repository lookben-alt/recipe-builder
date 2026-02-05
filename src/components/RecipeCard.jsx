export default function RecipeCard({ recipe, onView, onDelete, onAddToList, isInList }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          {recipe.prepTime && (
            <span>Prep: {recipe.prepTime}m</span>
          )}
          {recipe.cookTime && (
            <span>Cook: {recipe.cookTime}m</span>
          )}
          {recipe.servings && (
            <span>Serves: {recipe.servings}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onView(recipe)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Recipe
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onAddToList(recipe.id)}
              className={`flex-1 px-4 py-2 rounded transition-colors ${
                isInList
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isInList ? '✓ In List' : '+ Shopping List'}
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
