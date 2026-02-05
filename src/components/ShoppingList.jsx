import { useState } from 'react';

export default function ShoppingList({ recipes, onClose, onRemoveRecipe }) {
  const [checkedItems, setCheckedItems] = useState({});

  // Parse and aggregate ingredients
  const aggregateIngredients = () => {
    const allIngredients = [];

    recipes.forEach(recipe => {
      if (recipe.ingredients) {
        const lines = recipe.ingredients.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          allIngredients.push({
            text: line.trim(),
            recipeName: recipe.name
          });
        });
      }
    });

    return allIngredients;
  };

  const ingredients = aggregateIngredients();

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {recipes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recipes in your shopping list yet. Add some recipes to get started!
            </p>
          ) : (
            <>
              {/* Selected Recipes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Recipes ({recipes.length})</h3>
                <div className="space-y-2">
                  {recipes.map(recipe => (
                    <div key={recipe.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{recipe.name}</span>
                      <button
                        onClick={() => onRemoveRecipe(recipe.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients List */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Ingredients ({ingredients.length})</h3>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={checkedItems[index] || false}
                        onChange={() => toggleCheck(index)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className={`${checkedItems[index] ? 'line-through text-gray-400' : ''}`}>
                          {ingredient.text}
                        </p>
                        <p className="text-xs text-gray-500">from {ingredient.recipeName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Print List
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
