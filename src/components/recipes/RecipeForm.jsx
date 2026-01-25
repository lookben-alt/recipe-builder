import { useState } from 'react'
import { Button, Input, Textarea } from '../ui'

const TAGS = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Vegetarian', 'Quick']

export default function RecipeForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ingredients: initialData?.ingredients || '',
    instructions: initialData?.instructions || '',
    servings: initialData?.servings || 4,
    prepTime: initialData?.prepTime || 0,
    cookTime: initialData?.cookTime || 0,
    tags: initialData?.tags || []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }))
  }

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Recipe Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Spaghetti Bolognese"
        required
      />

      <Textarea
        label="Ingredients"
        name="ingredients"
        value={formData.ingredients}
        onChange={handleChange}
        placeholder="Enter one ingredient per line:
2 cups flour
1 lb ground beef
3 large eggs
1 can crushed tomatoes"
        helpText="Enter one ingredient per line with quantity and unit"
        rows={6}
        required
      />

      <Textarea
        label="Instructions"
        name="instructions"
        value={formData.instructions}
        onChange={handleChange}
        placeholder="1. Preheat oven to 350°F
2. Mix dry ingredients...
3. Add wet ingredients..."
        rows={6}
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Servings"
          name="servings"
          type="number"
          value={formData.servings}
          onChange={handleNumberChange}
          min="1"
        />
        <Input
          label="Prep (min)"
          name="prepTime"
          type="number"
          value={formData.prepTime}
          onChange={handleNumberChange}
          min="0"
        />
        <Input
          label="Cook (min)"
          name="cookTime"
          type="number"
          value={formData.cookTime}
          onChange={handleNumberChange}
          min="0"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.tags.includes(tag)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : initialData ? 'Update Recipe' : 'Add Recipe'}
        </Button>
      </div>
    </form>
  )
}
