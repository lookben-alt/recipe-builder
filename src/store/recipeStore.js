import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [],
      shoppingList: [], // Array of recipe IDs

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
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        shoppingList: state.shoppingList.filter(recipeId => recipeId !== id)
      })),

      getRecipe: (id) => {
        return get().recipes.find(recipe => recipe.id === id);
      },

      // Shopping list methods
      addToShoppingList: (recipeId) => set((state) => ({
        shoppingList: state.shoppingList.includes(recipeId)
          ? state.shoppingList
          : [...state.shoppingList, recipeId]
      })),

      removeFromShoppingList: (recipeId) => set((state) => ({
        shoppingList: state.shoppingList.filter(id => id !== recipeId)
      })),

      clearShoppingList: () => set({ shoppingList: [] }),

      getShoppingListRecipes: () => {
        const state = get();
        return state.shoppingList
          .map(id => state.recipes.find(recipe => recipe.id === id))
          .filter(Boolean);
      }
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecipeStore;
