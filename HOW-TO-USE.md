# Recipe Book App - Quick Start Guide

## Your Simple Recipe Manager

This app stores all your recipes directly in your browser - no database or complex setup needed!

## How to Use

### Opening the App

**Easiest Method:**
1. Open your Recipe builder folder
2. Go to the `dist` folder
3. Double-click `index.html`
4. The app will open in your default browser

### Features

- **Add Recipes**: Click the "+ Add Recipe" button to create a new recipe
- **Search**: Use the search bar to find recipes by name or tags
- **View Details**: Click "View Recipe" to see the full recipe
- **Delete**: Remove recipes you no longer need

### Data Storage

- All recipes are saved automatically in your browser's local storage
- Your recipes will persist even after closing the browser
- Each browser stores data separately (Chrome vs Firefox, etc.)

## Development

If you want to make changes to the app:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

When you're ready, we can add:
- Database integration (Airtable, Neon, etc.)
- Weekly meal planning
- Shopping list generation
- Recipe import/export
- Image uploads

---

Built with React, Vite, and Zustand
