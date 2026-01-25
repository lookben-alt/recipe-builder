import { neon } from '@neondatabase/serverless'

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL)

    const recipes = await sql`
      SELECT
        id,
        name,
        ingredients,
        instructions,
        servings,
        prep_time,
        cook_time,
        tags,
        image_url,
        created_at
      FROM recipes
      ORDER BY created_at DESC
    `

    const formattedRecipes = recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name || '',
      ingredients: recipe.ingredients || '',
      instructions: recipe.instructions || '',
      servings: recipe.servings || 4,
      prepTime: recipe.prep_time || 0,
      cookTime: recipe.cook_time || 0,
      tags: recipe.tags || [],
      image: recipe.image_url,
      createdAt: recipe.created_at
    }))

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedRecipes)
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch recipes' })
    }
  }
}
