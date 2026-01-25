import { useRef, useMemo } from 'react'
import RecipeCard from './RecipeCard'
import { Button, EmptyState } from '../ui'

export default function RecipeCardStack({
  recipes,
  onSwipeLeft,
  onSwipeRight,
  onReset
}) {
  const cardRefs = useRef([])

  // Reverse so first recipe is on top
  const displayRecipes = useMemo(() => [...recipes].reverse(), [recipes])

  const handleSwipe = (direction, recipe) => {
    if (direction === 'left') {
      onSwipeLeft?.(recipe)
    } else if (direction === 'right') {
      onSwipeRight?.(recipe)
    }
  }

  const handleCardLeftScreen = () => {
    // Card has left, could trigger animation or sound here
  }

  const swipeManually = (direction) => {
    if (displayRecipes.length > 0 && cardRefs.current[displayRecipes.length - 1]) {
      cardRefs.current[displayRecipes.length - 1].swipe(direction)
    }
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="All caught up!"
        description="You've swiped through all your recipes. Add more recipes or start over."
        action={
          <Button onClick={onReset}>Start Over</Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Card stack */}
      <div className="relative w-80 h-[450px]">
        {displayRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            ref={(el) => (cardRefs.current[index] = el)}
            recipe={recipe}
            onSwipe={(dir) => handleSwipe(dir, recipe)}
            onCardLeftScreen={handleCardLeftScreen}
          />
        ))}
      </div>

      {/* Manual swipe buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => swipeManually('left')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Skip recipe"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => swipeManually('right')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors"
          aria-label="Add to plan"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
