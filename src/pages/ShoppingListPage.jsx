import { ShoppingList } from '../components/shopping-list'
import useShoppingListStore from '../store/useShoppingListStore'

export default function ShoppingListPage() {
  const {
    items,
    checkedItems,
    toggleItem,
    clearChecked,
    getExportText,
    getUncheckedText
  } = useShoppingListStore()

  return (
    <div className="p-4">
      <ShoppingList
        items={items}
        checkedItems={checkedItems}
        onToggle={toggleItem}
        onClearChecked={clearChecked}
        getExportText={getExportText}
        getUncheckedText={getUncheckedText}
      />
    </div>
  )
}
