import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [],

      addRecipe: (recipe) => set((state) => ({
        recipes: [...state.recipes, {
          ...recipe,
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]
      })),

      updateRecipe: (id, updates) => set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? { ...recipe, ...updates } : recipe
        )
      })),

      deleteRecipe: (id) => set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id)
      })),

      getRecipe: (id) => {
        return get().recipes.find(recipe => recipe.id === id);
      }
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecipeStore;
