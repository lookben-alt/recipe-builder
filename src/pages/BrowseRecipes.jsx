import { useEffect, useState } from 'react'
import { RecipeCardStack } from '../components/recipes'
import { LoadingSpinner, EmptyState, Button } from '../components/ui'
import useRecipeStore from '../store/useRecipeStore'
import useWeeklyPlanStore from '../store/useWeeklyPlanStore'
import { useNavigate } from 'react-router-dom'

export default function BrowseRecipes() {
  const navigate = useNavigate()
  const {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    currentIndex,
    setCurrentIndex,
    resetSwipeStack
  } = useRecipeStore()

  const { addRecipe: addToPlan, fetchWeeklyPlan, isInPlan } = useWeeklyPlanStore()
  const [swipedIds, setSwipedIds] = useState(new Set())

  useEffect(() => {
    fetchRecipes()
    fetchWeeklyPlan()
  }, [fetchRecipes, fetchWeeklyPlan])

  // Filter out recipes already in plan and already swiped
  const visibleRecipes = recipes.filter(
    r => !isInPlan(r.id) && !swipedIds.has(r.id)
  )

  const handleSwipeLeft = (recipe) => {
    setSwipedIds(prev => new Set(prev).add(recipe.id))
  }

  const handleSwipeRight = async (recipe) => {
    try {
      await addToPlan(recipe.id)
      setSwipedIds(prev => new Set(prev).add(recipe.id))
    } catch (err) {
      console.error('Failed to add to plan:', err)
    }
  }

  const handleReset = () => {
    setSwipedIds(new Set())
    resetSwipeStack()
  }

  if (isLoading && recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <EmptyState
          icon={
            <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          title="Failed to load recipes"
          description={error}
          action={<Button onClick={fetchRecipes}>Try again</Button>}
        />
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="No recipes yet"
          description="Add your first recipe to get started!"
          action={<Button onClick={() => navigate('/add')}>Add Recipe</Button>}
        />
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-4">
        Swipe right to add, left to skip
      </p>
      <RecipeCardStack
        recipes={visibleRecipes}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onReset={handleReset}
      />
    </div>
  )
}
