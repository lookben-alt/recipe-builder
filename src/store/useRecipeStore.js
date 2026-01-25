import { create } from 'zustand'
import { recipeApi } from '../services/api'

const useRecipeStore = create((set, get) => ({
  recipes: [],
  currentIndex: 0,
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null })
    try {
      const recipes = await recipeApi.getAll()
      set({ recipes, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  addRecipe: async (recipe) => {
    set({ isLoading: true, error: null })
    try {
      const newRecipe = await recipeApi.create(recipe)
      set((state) => ({
        recipes: [newRecipe, ...state.recipes],
        isLoading: false
      }))
      return newRecipe
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateRecipe: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await recipeApi.update(id, updates)
      set((state) => ({
        recipes: state.recipes.map((r) => (r.id === id ? updated : r)),
        isLoading: false
      }))
      return updated
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteRecipe: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await recipeApi.delete(id)
      set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  setCurrentIndex: (index) => set({ currentIndex: index }),

  nextCard: () => {
    const { recipes, currentIndex } = get()
    if (currentIndex < recipes.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  resetSwipeStack: () => set({ currentIndex: 0 }),

  getVisibleRecipes: () => {
    const { recipes, currentIndex } = get()
    return recipes.slice(currentIndex)
  }
}))

export default useRecipeStore
