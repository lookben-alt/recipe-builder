import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { aggregateIngredients } from '../utils/ingredientAggregator'

const useShoppingListStore = create(
  persist(
    (set, get) => ({
      items: [],
      checkedItems: [],

      generateList: (recipes) => {
        const items = aggregateIngredients(recipes)
        set({ items, checkedItems: [] })
      },

      toggleItem: (itemId) => {
        const { checkedItems } = get()
        if (checkedItems.includes(itemId)) {
          set({ checkedItems: checkedItems.filter((id) => id !== itemId) })
        } else {
          set({ checkedItems: [...checkedItems, itemId] })
        }
      },

      isChecked: (itemId) => {
        return get().checkedItems.includes(itemId)
      },

      clearChecked: () => {
        const { items, checkedItems } = get()
        const remaining = items.filter((item) => !checkedItems.includes(item.id))
        set({ items: remaining, checkedItems: [] })
      },

      clearAll: () => {
        set({ items: [], checkedItems: [] })
      },

      getExportText: () => {
        const { items, checkedItems } = get()
        return items
          .map((item) => {
            const checked = checkedItems.includes(item.id) ? '[x]' : '[ ]'
            const qty = item.quantity ? `${item.quantity} ` : ''
            const unit = item.unit ? `${item.unit} ` : ''
            return `${checked} ${qty}${unit}${item.ingredient}`
          })
          .join('\n')
      },

      getUncheckedText: () => {
        const { items, checkedItems } = get()
        return items
          .filter((item) => !checkedItems.includes(item.id))
          .map((item) => {
            const qty = item.quantity ? `${item.quantity} ` : ''
            const unit = item.unit ? `${item.unit} ` : ''
            return `${qty}${unit}${item.ingredient}`
          })
          .join('\n')
      }
    }),
    {
      name: 'shopping-list-storage',
      partialize: (state) => ({
        items: state.items,
        checkedItems: state.checkedItems
      })
    }
  )
)

export default useShoppingListStore
