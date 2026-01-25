import Airtable from 'airtable'

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID)

    const records = await base('Recipes')
      .select({
        view: 'Grid view',
        sort: [{ field: 'CreatedAt', direction: 'desc' }]
      })
      .all()

    const recipes = records.map(record => ({
      id: record.id,
      name: record.fields.Name || '',
      ingredients: record.fields.Ingredients || '',
      instructions: record.fields.Instructions || '',
      servings: record.fields.Servings || 4,
      prepTime: record.fields.PrepTime || 0,
      cookTime: record.fields.CookTime || 0,
      tags: record.fields.Tags || [],
      image: record.fields.Image?.[0]?.url || null,
      createdAt: record.fields.CreatedAt
    }))

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipes)
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch recipes' })
    }
  }
}
