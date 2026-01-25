import { forwardRef } from 'react'
import TinderCard from 'react-tinder-card'

const RecipeCard = forwardRef(({ recipe, onSwipe, onCardLeftScreen }, ref) => {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <TinderCard
      ref={ref}
      onSwipe={onSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['up', 'down']}
      className="absolute"
    >
      <div className="w-80 h-[450px] bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Image or placeholder */}
        <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.name}</h3>

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {recipe.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{totalTime} min</span>
              </div>
            )}
            {recipe.servings > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>

          {/* Ingredient preview */}
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Ingredients:</p>
            <p className="line-clamp-3">
              {recipe.ingredients?.split('\n').slice(0, 3).join(', ')}
              {recipe.ingredients?.split('\n').length > 3 && '...'}
            </p>
          </div>
        </div>

        {/* Swipe hints */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 pointer-events-none">
          <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-medium">
            Skip
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
            Add
          </div>
        </div>
      </div>
    </TinderCard>
  )
})

RecipeCard.displayName = 'RecipeCard'

export default RecipeCard
