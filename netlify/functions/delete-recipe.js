import Airtable from 'airtable'

export const handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
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

    await base('Recipes').destroy(data.id)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete recipe' })
    }
  }
}
