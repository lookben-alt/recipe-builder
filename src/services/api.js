const API_BASE = '/.netlify/functions'

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

export const recipeApi = {
  getAll: () => fetchApi('get-recipes'),
  getOne: (id) => fetchApi(`get-recipe?id=${id}`),
  create: (data) => fetchApi('create-recipe', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi('update-recipe', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data })
  }),
  delete: (id) => fetchApi('delete-recipe', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

export const weeklyPlanApi = {
  get: () => fetchApi('get-weekly-plan'),
  update: (data) => fetchApi('update-weekly-plan', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
