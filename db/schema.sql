-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ingredients TEXT,
  instructions TEXT,
  servings INTEGER DEFAULT 4,
  prep_time INTEGER DEFAULT 0,
  cook_time INTEGER DEFAULT 0,
  tags TEXT[], -- PostgreSQL array for tags
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly plan table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id SERIAL PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  selected_recipe_ids INTEGER[], -- Array of recipe IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster week lookups
CREATE INDEX IF NOT EXISTS idx_weekly_plans_week_start ON weekly_plans(week_start);
