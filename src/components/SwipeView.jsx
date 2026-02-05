import { useState, useMemo } from 'react';
import TinderCard from 'react-tinder-card';

export default function SwipeView({ recipes, onAddToList, onView, isInList }) {
  const [currentIndex, setCurrentIndex] = useState(recipes.length - 1);
  const [lastDirection, setLastDirection] = useState();

  const currentIndexRef = useMemo(() => ({ value: currentIndex }), [currentIndex]);

  const childRefs = useMemo(
    () => Array(recipes.length).fill(0).map(() => ({ current: null })),
    [recipes.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.value = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, recipeId, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    // Right swipe = add to shopping list
    if (direction === 'right') {
      onAddToList(recipeId);
    }
    // Up swipe = view details
    if (direction === 'up') {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) onView(recipe);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.value);
    if (currentIndexRef.value >= idx && childRefs[idx].current) {
      childRefs[idx].current = null;
    }
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < recipes.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-500 text-lg mb-4">No recipes to swipe through!</p>
        <p className="text-gray-400 text-sm">Add some recipes to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Instructions */}
      <div className="mb-6 text-center bg-blue-50 p-4 rounded-lg max-w-md">
        <p className="text-sm text-blue-800 font-medium mb-2">Swipe Instructions:</p>
        <div className="text-xs text-blue-600 space-y-1">
          <p>👉 Swipe RIGHT to add to shopping list</p>
          <p>👈 Swipe LEFT to skip</p>
          <p>👆 Swipe UP to view full recipe</p>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[600px]">
        {recipes.map((recipe, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={recipe.id}
            onSwipe={(dir) => swiped(dir, recipe.id, index)}
            onCardLeftScreen={() => outOfFrame(recipe.name, index)}
            preventSwipe={['down']}
            className="absolute w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] cursor-grab active:cursor-grabbing">
              {/* Image */}
              {recipe.image ? (
                <div className="h-64 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">🍳</span>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{recipe.name}</h2>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-6 text-gray-600 mb-4">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">⏱️ {recipe.prepTime}m prep</span>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🔥 {recipe.cookTime}m cook</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🍽️ {recipe.servings} servings</span>
                    </div>
                  )}
                </div>

                {/* Preview of ingredients */}
                {recipe.ingredients && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Ingredients:</p>
                    <p className="line-clamp-3">{recipe.ingredients}</p>
                  </div>
                )}
              </div>

              {/* Already in list indicator */}
              {isInList(recipe.id) && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ In Shopping List
                </div>
              )}
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Manual Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => swipe('left')}
          disabled={!canSwipe}
          className="bg-red-500 text-white rounded-full p-4 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-2xl">👈</span>
        </button>
        <button
          onClick={() => swipe('up')}
          disabled={!canSwipe}
          className="bg-blue-500 text-white rounded-full p-4 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-2xl">👆</span>
        </button>
        <button
          onClick={() => swipe('right')}
          disabled={!canSwipe}
          className="bg-green-500 text-white rounded-full p-4 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-2xl">👉</span>
        </button>
      </div>

      {/* Counter */}
      <div className="mt-4 text-gray-500 text-sm">
        {currentIndex + 1} of {recipes.length} recipes remaining
      </div>

      {lastDirection && (
        <div className="mt-2 text-sm font-medium">
          {lastDirection === 'right' && <span className="text-green-600">✓ Added to shopping list!</span>}
          {lastDirection === 'left' && <span className="text-gray-600">Skipped</span>}
          {lastDirection === 'up' && <span className="text-blue-600">Viewing recipe...</span>}
        </div>
      )}
    </div>
  );
}
