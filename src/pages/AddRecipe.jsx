import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipeForm } from '../components/recipes'
import useRecipeStore from '../store/useRecipeStore'

export default function AddRecipe() {
  const navigate = useNavigate()
  const { addRecipe, isLoading } = useRecipeStore()
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setError(null)
    try {
      await addRecipe(formData)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Recipe</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
