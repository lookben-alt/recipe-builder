import { neon } from '@neondatabase/serverless'

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
    const sql = neon(process.env.NETLIFY_DATABASE_URL)
    const weekStart = data.weekStart || getWeekStart()
    const selectedRecipeIds = data.selectedRecipeIds || []

    // Upsert: insert or update if week already exists
    const result = await sql`
      INSERT INTO weekly_plans (week_start, selected_recipe_ids)
      VALUES (${weekStart}, ${selectedRecipeIds})
      ON CONFLICT (week_start)
      DO UPDATE SET selected_recipe_ids = ${selectedRecipeIds}
      RETURNING id, week_start, selected_recipe_ids
    `

    const plan = result[0]

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: plan.id,
        weekStart: plan.week_start,
        selectedRecipeIds: plan.selected_recipe_ids || []
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
