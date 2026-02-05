# AI Recipe Parser Setup Guide

## ⚠️ IMPORTANT: Secure Your API Key

**First, revoke the API key you shared earlier:**
1. Go to https://console.anthropic.com/settings/keys
2. Find and delete the key starting with `sk-ant-api03-cC7LNtk...`
3. Create a new API key

## Setup Steps

### 1. Get a New Claude API Key
1. Go to https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copy the new key (starts with `sk-ant-api03-...`)

### 2. Add API Key to Netlify (Secure Method)
1. Go to https://app.netlify.com
2. Click on your "easypie" site
3. Go to "Site configuration" → "Environment variables"
4. Click "Add a variable"
5. Add:
   - **Key:** `CLAUDE_API_KEY`
   - **Value:** [paste your new API key here]
6. Click "Save"

### 3. Redeploy Your Site
After adding the environment variable:
1. Go to "Deploys" in Netlify
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete (~1-2 minutes)

## How to Use

Once deployed:

1. Click "+ Add Recipe" button
2. Click "✨ AI Recipe Parser (Paste & Auto-fill)"
3. Paste any recipe text (from a website, email, message, etc.)
4. Click "✨ Parse Recipe"
5. The AI will extract and auto-fill:
   - Recipe name
   - Ingredients (formatted, one per line)
   - Instructions
   - Prep time, cook time, servings
   - Suggested tags

6. Review and edit as needed
7. Save!

## What It Can Parse

The AI can handle recipes from:
- Recipe websites
- Social media posts
- Text messages
- Emails
- Screenshots (if you copy the text)
- Any unformatted recipe text

## Cost

Claude API pricing (as of now):
- ~$0.003 per recipe parse (very cheap!)
- Typical usage: $0.30 for 100 recipes

## Troubleshooting

**"Failed to parse recipe"**
- Make sure you've added the `CLAUDE_API_KEY` environment variable in Netlify
- Make sure you've redeployed after adding it
- Check the recipe text has actual recipe content

**Still not working?**
- Go to Netlify → Functions → Check parse-recipe logs
- Verify the API key is correctly set in environment variables

## Security Note

Your API key is now stored securely in Netlify and is NEVER exposed to users or in your frontend code. This is the correct way to handle API keys!
