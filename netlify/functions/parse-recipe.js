export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { recipeText } = JSON.parse(event.body);

    if (!recipeText || recipeText.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Recipe text is required' })
      };
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Parse this recipe and extract structured information. Return ONLY a JSON object with these exact fields (no markdown, no explanation):
{
  "name": "recipe name",
  "ingredients": "one ingredient per line",
  "instructions": "step by step instructions",
  "prepTime": number in minutes or null,
  "cookTime": number in minutes or null,
  "servings": number or null,
  "tags": ["tag1", "tag2"]
}

Recipe to parse:
${recipeText}`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to parse recipe' })
      };
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Try to parse the JSON response
    let parsedRecipe;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedRecipe = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse Claude response as JSON:', content);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to parse AI response' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsedRecipe)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
