import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { WeeklyPlanView } from '../components/weekly-plan'
import { LoadingSpinner } from '../components/ui'
import useWeeklyPlanStore from '../store/useWeeklyPlanStore'
import useRecipeStore from '../store/useRecipeStore'
import useShoppingListStore from '../store/useShoppingListStore'

export default function WeeklyPlan() {
  const navigate = useNavigate()

  const {
    weeklyPlan,
    isLoading: planLoading,
    fetchWeeklyPlan,
    removeRecipe,
    clearWeek
  } = useWeeklyPlanStore()

  const { recipes, fetchRecipes, isLoading: recipesLoading } = useRecipeStore()
  const { generateList } = useShoppingListStore()

  useEffect(() => {
    fetchWeeklyPlan()
    fetchRecipes()
  }, [fetchWeeklyPlan, fetchRecipes])

  // Get full recipe objects for the selected IDs
  const plannedRecipes = useMemo(() => {
    if (!weeklyPlan?.selectedRecipes || !recipes.length) return []

    return weeklyPlan.selectedRecipes
      .map(id => recipes.find(r => r.id === id))
      .filter(Boolean)
  }, [weeklyPlan, recipes])

  const handleRemoveRecipe = async (recipeId) => {
    try {
      await removeRecipe(recipeId)
    } catch (err) {
      console.error('Failed to remove recipe:', err)
    }
  }

  const handleClearWeek = async () => {
    if (window.confirm('Clear all recipes from this week?')) {
      try {
        await clearWeek()
      } catch (err) {
        console.error('Failed to clear week:', err)
      }
    }
  }

  const handleGenerateList = () => {
    generateList(plannedRecipes)
    navigate('/shopping')
  }

  const isLoading = planLoading || recipesLoading

  if (isLoading && !weeklyPlan) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <WeeklyPlanView
        recipes={plannedRecipes}
        onRemoveRecipe={handleRemoveRecipe}
        onClearWeek={handleClearWeek}
        onGenerateList={handleGenerateList}
      />
    </div>
  )
}
