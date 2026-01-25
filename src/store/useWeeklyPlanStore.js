import { create } from 'zustand'
import { weeklyPlanApi } from '../services/api'

const useWeeklyPlanStore = create((set, get) => ({
  weeklyPlan: null,
  isLoading: false,
  error: null,

  fetchWeeklyPlan: async () => {
    set({ isLoading: true, error: null })
    try {
      const plan = await weeklyPlanApi.get()
      set({ weeklyPlan: plan, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  addRecipe: async (recipeId) => {
    const { weeklyPlan } = get()
    const currentRecipes = weeklyPlan?.selectedRecipes || []

    // Don't add if already in plan
    if (currentRecipes.includes(recipeId)) {
      return
    }

    const newRecipes = [...currentRecipes, recipeId]

    set({ isLoading: true, error: null })
    try {
      const updated = await weeklyPlanApi.update({
        selectedRecipes: newRecipes
      })
      set({ weeklyPlan: updated, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  removeRecipe: async (recipeId) => {
    const { weeklyPlan } = get()
    const currentRecipes = weeklyPlan?.selectedRecipes || []
    const newRecipes = currentRecipes.filter((id) => id !== recipeId)

    set({ isLoading: true, error: null })
    try {
      const updated = await weeklyPlanApi.update({
        selectedRecipes: newRecipes
      })
      set({ weeklyPlan: updated, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  clearWeek: async () => {
    set({ isLoading: true, error: null })
    try {
      const updated = await weeklyPlanApi.update({
        selectedRecipes: []
      })
      set({ weeklyPlan: updated, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  isInPlan: (recipeId) => {
    const { weeklyPlan } = get()
    return weeklyPlan?.selectedRecipes?.includes(recipeId) || false
  }
}))

export default useWeeklyPlanStore
