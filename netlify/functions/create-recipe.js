import Airtable from 'airtable'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const data = JSON.parse(event.body)

    if (!data.name || !data.ingredients) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and ingredients are required' })
      }
    }

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID)

    const record = await base('Recipes').create({
      Name: data.name,
      Ingredients: data.ingredients,
      Instructions: data.instructions || '',
      Servings: data.servings || 4,
      PrepTime: data.prepTime || 0,
      CookTime: data.cookTime || 0,
      Tags: data.tags || []
    })

    return {
      statusCode: 201,
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
    console.error('Error creating recipe:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create recipe' })
    }
  }
}
