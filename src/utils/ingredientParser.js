// Simple ingredient parser (client-side, no npm dependency for easier maintenance)
// Handles common formats like "2 cups flour", "1 lb ground beef", "3 large eggs"

const UNIT_PATTERNS = {
  // Volume
  cup: /\b(cups?)\b/i,
  tablespoon: /\b(tablespoons?|tbsps?|tbs?)\b/i,
  teaspoon: /\b(teaspoons?|tsps?)\b/i,
  liter: /\b(liters?|litres?|l)\b/i,
  milliliter: /\b(milliliters?|millilitres?|ml)\b/i,
  // Weight
  pound: /\b(pounds?|lbs?)\b/i,
  ounce: /\b(ounces?|oz)\b/i,
  gram: /\b(grams?|g)\b/i,
  kilogram: /\b(kilograms?|kg)\b/i,
  // Count
  piece: /\b(pieces?|pcs?)\b/i,
  slice: /\b(slices?)\b/i,
  can: /\b(cans?)\b/i,
  jar: /\b(jars?)\b/i,
  clove: /\b(cloves?)\b/i,
  head: /\b(heads?)\b/i,
  bunch: /\b(bunches?)\b/i
}

const QUANTITY_PATTERN = /^([\d\/\.\s]+)/

const DESCRIPTORS = [
  'large', 'small', 'medium', 'fresh', 'dried', 'chopped', 'diced',
  'minced', 'sliced', 'whole', 'boneless', 'skinless', 'organic',
  'frozen', 'canned', 'packed', 'roughly', 'finely', 'thinly'
]

function parseQuantity(str) {
  const match = str.match(QUANTITY_PATTERN)
  if (!match) return null

  const qty = match[1].trim()

  // Handle fractions like "1/2" or "1 1/2"
  if (qty.includes('/')) {
    const parts = qty.split(/\s+/)
    let total = 0
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, denom] = part.split('/')
        total += parseInt(num) / parseInt(denom)
      } else {
        total += parseFloat(part) || 0
      }
    }
    return total
  }

  return parseFloat(qty) || null
}

function parseUnit(str) {
  for (const [unit, pattern] of Object.entries(UNIT_PATTERNS)) {
    if (pattern.test(str)) {
      return unit
    }
  }
  return null
}

function cleanIngredientName(str, quantity, unit) {
  let cleaned = str

  // Remove quantity from start
  if (quantity !== null) {
    cleaned = cleaned.replace(QUANTITY_PATTERN, '')
  }

  // Remove unit
  if (unit) {
    const pattern = UNIT_PATTERNS[unit]
    cleaned = cleaned.replace(pattern, '')
  }

  // Remove common descriptors (but keep them if that's all there is)
  const words = cleaned.split(/\s+/).filter(Boolean)
  const nonDescriptors = words.filter(
    w => !DESCRIPTORS.includes(w.toLowerCase())
  )

  if (nonDescriptors.length > 0) {
    cleaned = nonDescriptors.join(' ')
  } else {
    cleaned = words.join(' ')
  }

  // Clean up punctuation and whitespace
  cleaned = cleaned
    .replace(/^[\s,.-]+/, '')
    .replace(/[\s,.-]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned || str.trim()
}

export function parseIngredient(line) {
  const trimmed = line.trim()
  if (!trimmed) return null

  const quantity = parseQuantity(trimmed)
  const unit = parseUnit(trimmed)
  const ingredient = cleanIngredientName(trimmed, quantity, unit)

  return {
    quantity,
    unit,
    ingredient,
    original: trimmed
  }
}

export function parseIngredients(rawText) {
  if (!rawText) return []

  const lines = rawText.split('\n').filter(line => line.trim())

  return lines
    .map(line => parseIngredient(line))
    .filter(Boolean)
}
