export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">{recipe.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-6 text-gray-600 mb-6 pb-6 border-b">
            {recipe.prepTime && (
              <div>
                <div className="text-sm text-gray-500">Prep Time</div>
                <div className="font-semibold">{recipe.prepTime} min</div>
              </div>
            )}
            {recipe.cookTime && (
              <div>
                <div className="text-sm text-gray-500">Cook Time</div>
                <div className="font-semibold">{recipe.cookTime} min</div>
              </div>
            )}
            {recipe.servings && (
              <div>
                <div className="text-sm text-gray-500">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Ingredients</h3>
            <div className="whitespace-pre-line text-gray-700">
              {recipe.ingredients}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Instructions</h3>
            <div className="whitespace-pre-line text-gray-700">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
