import Airtable from 'airtable'

function getWeekStart() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID)

    const weekStart = getWeekStart()

    const records = await base('WeeklyPlan')
      .select({
        filterByFormula: `{WeekStart} = '${weekStart}'`,
        maxRecords: 1
      })
      .all()

    if (records.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStart,
          selectedRecipes: []
        })
      }
    }

    const record = records[0]

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: record.id,
        weekStart: record.fields.WeekStart,
        selectedRecipes: record.fields.SelectedRecipes || []
      })
    }
  } catch (error) {
    console.error('Error fetching weekly plan:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weekly plan' })
    }
  }
}
