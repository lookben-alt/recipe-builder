import { neon } from '@neondatabase/serverless'

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
    const sql = neon(process.env.NETLIFY_DATABASE_URL)
    const weekStart = getWeekStart()

    const plans = await sql`
      SELECT id, week_start, selected_recipe_ids, created_at
      FROM weekly_plans
      WHERE week_start = ${weekStart}
      LIMIT 1
    `

    if (plans.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStart,
          selectedRecipes: []
        })
      }
    }

    const plan = plans[0]

    // Fetch the actual recipe data for the selected IDs
    let selectedRecipes = []
    if (plan.selected_recipe_ids && plan.selected_recipe_ids.length > 0) {
      selectedRecipes = await sql`
        SELECT id, name, ingredients, instructions, servings, prep_time, cook_time, tags, image_url
        FROM recipes
        WHERE id = ANY(${plan.selected_recipe_ids})
      `
      selectedRecipes = selectedRecipes.map(r => ({
        id: r.id,
        name: r.name,
        ingredients: r.ingredients,
        instructions: r.instructions,
        servings: r.servings,
        prepTime: r.prep_time,
        cookTime: r.cook_time,
        tags: r.tags || [],
        image: r.image_url
      }))
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: plan.id,
        weekStart: plan.week_start,
        selectedRecipes
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
