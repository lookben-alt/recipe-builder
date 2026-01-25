import { parseIngredients } from './ingredientParser'

const INGREDIENT_CATEGORIES = {
  // Produce
  tomato: 'Produce', onion: 'Produce', garlic: 'Produce', lettuce: 'Produce',
  carrot: 'Produce', potato: 'Produce', pepper: 'Produce', cucumber: 'Produce',
  spinach: 'Produce', broccoli: 'Produce', mushroom: 'Produce', celery: 'Produce',
  lemon: 'Produce', lime: 'Produce', apple: 'Produce', banana: 'Produce',
  avocado: 'Produce', ginger: 'Produce', basil: 'Produce', cilantro: 'Produce',
  parsley: 'Produce', thyme: 'Produce', rosemary: 'Produce', mint: 'Produce',
  zucchini: 'Produce', squash: 'Produce', cabbage: 'Produce', kale: 'Produce',
  // Meat & Protein
  beef: 'Meat', chicken: 'Meat', pork: 'Meat', bacon: 'Meat', turkey: 'Meat',
  lamb: 'Meat', sausage: 'Meat', steak: 'Meat', mince: 'Meat',
  salmon: 'Seafood', tuna: 'Seafood', shrimp: 'Seafood', fish: 'Seafood',
  prawn: 'Seafood', cod: 'Seafood',
  // Dairy
  milk: 'Dairy', butter: 'Dairy', cheese: 'Dairy', cream: 'Dairy',
  yogurt: 'Dairy', egg: 'Dairy', eggs: 'Dairy', parmesan: 'Dairy',
  mozzarella: 'Dairy', cheddar: 'Dairy',
  // Pantry
  flour: 'Pantry', sugar: 'Pantry', salt: 'Pantry', oil: 'Pantry',
  pasta: 'Pantry', rice: 'Pantry', bread: 'Pantry', vinegar: 'Pantry',
  soy: 'Pantry', sauce: 'Pantry', stock: 'Pantry', broth: 'Pantry',
  honey: 'Pantry', maple: 'Pantry', baking: 'Pantry', yeast: 'Pantry',
  noodle: 'Pantry', bean: 'Pantry', lentil: 'Pantry', chickpea: 'Pantry'
}

function categorizeIngredient(ingredientName) {
  const lower = ingredientName.toLowerCase()

  // Check exact matches first
  for (const [key, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (lower === key || lower === key + 's') {
      return category
    }
  }

  // Check partial matches
  for (const [key, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (lower.includes(key)) {
      return category
    }
  }

  return 'Other'
}

function normalizeIngredientName(name) {
  return name
    .toLowerCase()
    .replace(/ies$/, 'y')  // berries -> berry
    .replace(/es$/, '')    // tomatoes -> tomato
    .replace(/s$/, '')     // onions -> onion
    .trim()
}

function canCombine(item1, item2) {
  // Can combine if same unit or both have no unit
  if (item1.unit === item2.unit) return true
  if (!item1.unit && !item2.unit) return true
  return false
}

export function aggregateIngredients(recipes) {
  // Collect all parsed ingredients from selected recipes
  const allIngredients = recipes.flatMap(recipe => {
    return parseIngredients(recipe.ingredients).map(ing => ({
      ...ing,
      recipeName: recipe.name
    }))
  })

  // Group by normalized ingredient name
  const grouped = {}
  allIngredients.forEach(ing => {
    const key = normalizeIngredientName(ing.ingredient)
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(ing)
  })

  // Combine quantities where possible
  const aggregated = Object.entries(grouped).map(([key, items]) => {
    // Try to combine items with matching units
    const combined = []
    const used = new Set()

    items.forEach((item, i) => {
      if (used.has(i)) return

      let totalQty = item.quantity || 0
      const recipes = [item.recipeName]

      items.forEach((other, j) => {
        if (i === j || used.has(j)) return
        if (canCombine(item, other)) {
          totalQty += other.quantity || 0
          recipes.push(other.recipeName)
          used.add(j)
        }
      })

      used.add(i)
      combined.push({
        id: `${key}-${item.unit || 'none'}`,
        ingredient: item.ingredient,
        quantity: totalQty || null,
        unit: item.unit,
        category: categorizeIngredient(item.ingredient),
        recipes: [...new Set(recipes)]
      })
    })

    return combined
  }).flat()

  // Sort by category, then alphabetically
  return aggregated.sort((a, b) => {
    const categoryOrder = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Pantry', 'Other']
    const aOrder = categoryOrder.indexOf(a.category)
    const bOrder = categoryOrder.indexOf(b.category)

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    return a.ingredient.localeCompare(b.ingredient)
  })
}
