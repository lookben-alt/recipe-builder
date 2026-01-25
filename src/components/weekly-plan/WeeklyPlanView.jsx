import PlannedRecipeCard from './PlannedRecipeCard'
import { Button, EmptyState } from '../ui'

export default function WeeklyPlanView({
  recipes,
  onRemoveRecipe,
  onClearWeek,
  onGenerateList
}) {
  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        title="No recipes planned"
        description="Swipe right on recipes to add them to your weekly plan."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          This Week ({recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'})
        </h2>
        {recipes.length > 0 && (
          <button
            onClick={onClearWeek}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {recipes.map(recipe => (
          <PlannedRecipeCard
            key={recipe.id}
            recipe={recipe}
            onRemove={onRemoveRecipe}
          />
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={onGenerateList} className="w-full">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Generate Shopping List
          </span>
        </Button>
      </div>
    </div>
  )
}
