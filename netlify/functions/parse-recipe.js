export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if API key is configured
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured. Please add CLAUDE_API_KEY to Netlify environment variables.' })
      };
    }

    const { recipeText, recipeUrl } = JSON.parse(event.body);
    let contentToParse = recipeText;
    let extractedImage = null;

    // If URL provided, fetch the webpage
    if (recipeUrl && recipeUrl.trim().length > 0) {
      try {
        const pageResponse = await fetch(recipeUrl);
        if (!pageResponse.ok) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Failed to fetch recipe URL' })
          };
        }

        const html = await pageResponse.text();

        // Extract main content (simple approach - get text between body tags)
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;

        // Remove script and style tags
        const cleanedContent = bodyContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        contentToParse = cleanedContent;

        // Try to find recipe image (look for common patterns)
        const imagePatterns = [
          /<meta property="og:image" content="([^"]+)"/i,
          /<img[^>]*class="[^"]*recipe[^"]*"[^>]*src="([^"]+)"/i,
          /<img[^>]*src="([^"]*recipe[^"]*)"/i,
          /<img[^>]*src="([^"]+)"[^>]*alt="[^"]*recipe[^"]*"/i
        ];

        for (const pattern of imagePatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            extractedImage = match[1];
            // Make relative URLs absolute
            if (extractedImage.startsWith('/')) {
              const urlObj = new URL(recipeUrl);
              extractedImage = `${urlObj.protocol}//${urlObj.host}${extractedImage}`;
            }
            break;
          }
        }
      } catch (urlError) {
        console.error('Error fetching URL:', urlError);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Failed to fetch or parse recipe URL' })
        };
      }
    }

    if (!contentToParse || contentToParse.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Recipe text or URL is required' })
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
  "tags": ["tag1", "tag2"],
  "image": "image URL if found, otherwise null"
}

Recipe to parse:
${contentToParse}

${extractedImage ? `\nFound image URL: ${extractedImage}` : ''}`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error status:', response.status);
      console.error('Claude API error body:', errorText);

      let errorMessage = 'Claude API error: ';
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your CLAUDE_API_KEY in Netlify.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (response.status === 400) {
        errorMessage = 'Bad request to Claude API. Please check your input.';
      } else {
        errorMessage = `Claude API error (${response.status}). Check Netlify function logs for details.`;
      }

      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorMessage })
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

      // If we extracted an image but Claude didn't include it, add it
      if (extractedImage && !parsedRecipe.image) {
        parsedRecipe.image = extractedImage;
      }
    } catch (e) {
      console.error('Failed to parse Claude response as JSON:', e.message);
      console.error('Claude response was:', content);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Failed to parse AI response. The AI returned invalid JSON. Check Netlify logs for details.`
        })
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
    console.error('Unexpected error:', error.message);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Internal error: ${error.message}. Check Netlify function logs for details.`
      })
    };
  }
};
