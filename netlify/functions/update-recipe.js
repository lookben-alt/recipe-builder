import Airtable from 'airtable'

export const handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const data = JSON.parse(event.body)

    if (!data.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Recipe ID is required' })
      }
    }

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID)

    const fields = {}
    if (data.name !== undefined) fields.Name = data.name
    if (data.ingredients !== undefined) fields.Ingredients = data.ingredients
    if (data.instructions !== undefined) fields.Instructions = data.instructions
    if (data.servings !== undefined) fields.Servings = data.servings
    if (data.prepTime !== undefined) fields.PrepTime = data.prepTime
    if (data.cookTime !== undefined) fields.CookTime = data.cookTime
    if (data.tags !== undefined) fields.Tags = data.tags

    const record = await base('Recipes').update(data.id, fields)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: record.id,
        name: record.fields.Name,
        ingredients: record.fields.Ingredients,
        instructions: record.fields.Instructions,
        servings: record.fields.Servings,
        prepTime: record.fields.PrepTime,
        cookTime: record.fields.CookTime,
        tags: record.fields.Tags || []
      })
    }
  } catch (error) {
    console.error('Error updating recipe:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update recipe' })
    }
  }
}
