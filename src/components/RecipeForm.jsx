import { useState } from 'react';

export default function RecipeForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    ingredients: initialData.ingredients || '',
    instructions: initialData.instructions || '',
    prepTime: initialData.prepTime || '',
    cookTime: initialData.cookTime || '',
    servings: initialData.servings || '',
    tags: initialData.tags?.join(', ') || '',
    image: initialData.image || ''
  });
  const [showAiParser, setShowAiParser] = useState(false);
  const [rawRecipe, setRawRecipe] = useState('');
  const [recipeUrl, setRecipeUrl] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'url'
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipe = {
      ...formData,
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
      cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
      servings: formData.servings ? parseInt(formData.servings) : null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    onSubmit(recipe);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAiParse = async () => {
    const payload = {};

    if (inputMode === 'url') {
      if (!recipeUrl.trim()) {
        setParseError('Please enter a recipe URL');
        return;
      }
      payload.recipeUrl = recipeUrl;
    } else {
      if (!rawRecipe.trim()) {
        setParseError('Please paste some recipe text');
        return;
      }
      payload.recipeText = rawRecipe;
    }

    setParsing(true);
    setParseError('');

    try {
      const response = await fetch('/.netlify/functions/parse-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to parse recipe');
      }

      const parsed = await response.json();

      // Update form with parsed data
      setFormData({
        name: parsed.name || '',
        ingredients: parsed.ingredients || '',
        instructions: parsed.instructions || '',
        prepTime: parsed.prepTime || '',
        cookTime: parsed.cookTime || '',
        servings: parsed.servings || '',
        tags: parsed.tags ? parsed.tags.join(', ') : '',
        image: parsed.image || ''
      });

      setShowAiParser(false);
      setRawRecipe('');
      setRecipeUrl('');
    } catch (error) {
      console.error('Parse error:', error);
      setParseError('Failed to parse recipe. Please try again or fill manually.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* AI Parser Section */}
      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() => setShowAiParser(!showAiParser)}
          className="w-full flex items-center justify-between text-left font-medium text-purple-600 hover:text-purple-700"
        >
          <span>✨ AI Recipe Parser (Paste & Auto-fill)</span>
          <span>{showAiParser ? '−' : '+'}</span>
        </button>

        {showAiParser && (
          <div className="mt-3 space-y-3">
            {/* Toggle between text and URL */}
            <div className="flex gap-2 border-b">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-4 py-2 ${
                  inputMode === 'text'
                    ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`px-4 py-2 ${
                  inputMode === 'url'
                    ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                From URL
              </button>
            </div>

            {inputMode === 'text' ? (
              <textarea
                value={rawRecipe}
                onChange={(e) => setRawRecipe(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Paste recipe text from anywhere (website, message, etc.) and click Parse..."
              />
            ) : (
              <input
                type="url"
                value={recipeUrl}
                onChange={(e) => setRecipeUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/recipe-page"
              />
            )}

            {parseError && (
              <p className="text-sm text-red-600">{parseError}</p>
            )}
            <button
              type="button"
              onClick={handleAiParse}
              disabled={parsing}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {parsing ? 'Parsing with AI...' : '✨ Parse Recipe'}
            </button>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Spaghetti Carbonara"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ingredients *</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="One ingredient per line"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Instructions *</label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Step by step instructions"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
          <input
            type="number"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cook Time (min)</label>
          <input
            type="number"
            name="cookTime"
            value={formData.cookTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Servings</label>
          <input
            type="number"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Italian, Quick, Vegetarian"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Save Recipe
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
