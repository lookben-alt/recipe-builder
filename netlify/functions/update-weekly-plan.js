import Airtable from 'airtable'

function getWeekStart() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export const handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const data = JSON.parse(event.body)

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID)

    const weekStart = data.weekStart || getWeekStart()

    // Check if a plan exists for this week
    const existing = await base('WeeklyPlan')
      .select({
        filterByFormula: `{WeekStart} = '${weekStart}'`,
        maxRecords: 1
      })
      .all()

    let record
    if (existing.length > 0) {
      // Update existing
      record = await base('WeeklyPlan').update(existing[0].id, {
        SelectedRecipes: data.selectedRecipes || []
      })
    } else {
      // Create new
      record = await base('WeeklyPlan').create({
        WeekStart: weekStart,
        SelectedRecipes: data.selectedRecipes || []
      })
    }

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
    console.error('Error updating weekly plan:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update weekly plan' })
    }
  }
}
