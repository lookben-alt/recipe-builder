-- Seed data from your Airtable recipes
INSERT INTO recipes (name, ingredients, instructions, servings, prep_time, cook_time, tags, image_url) VALUES
(
  'Spaghetti Carbonara',
  '400g spaghetti
200g guanciale or pancetta, diced
4 large egg yolks
1 whole egg
100g Pecorino Romano, finely grated
Freshly ground black pepper
Salt for pasta water',
  'Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente. While pasta cooks, fry guanciale in a large pan over medium heat until crispy, about 8 minutes. In a bowl, whisk together egg yolks, whole egg, and most of the Pecorino. Reserve 1 cup pasta water, then drain pasta. Add pasta to the pan with guanciale (off heat), then quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce. Season with pepper and serve immediately with remaining Pecorino.',
  4, 10, 20,
  ARRAY['Dinner', 'Italian', 'Pasta'],
  NULL
),
(
  'Thai Green Curry',
  '400ml coconut milk
3 tbsp green curry paste
500g chicken thigh, sliced
200g Thai aubergines or regular aubergine, quartered
100g bamboo shoots
2 tbsp fish sauce
1 tbsp palm sugar or brown sugar
Thai basil leaves
2 kaffir lime leaves
1 red chilli, sliced',
  'Heat a wok over high heat. Add half the coconut milk and the curry paste, stirring until fragrant and oil separates. Add chicken and stir-fry for 3 minutes. Pour in remaining coconut milk, add aubergines and bamboo shoots. Simmer for 10 minutes until chicken is cooked through. Season with fish sauce and sugar. Tear in kaffir lime leaves and most of the Thai basil. Serve over jasmine rice, garnished with remaining basil and sliced chilli.',
  4, 15, 20,
  ARRAY['Dinner', 'Thai', 'Spicy'],
  NULL
),
(
  'Classic Margherita Pizza',
  '500g strong bread flour
7g instant yeast
10g salt
325ml warm water
2 tbsp olive oil
400g San Marzano tomatoes, crushed
2 garlic cloves, minced
250g fresh mozzarella, torn
Fresh basil leaves
Extra virgin olive oil for drizzling',
  'Mix flour, yeast and salt. Add water and oil, knead for 10 minutes until smooth. Cover and prove for 1 hour. Preheat oven to 250°C with a baking stone if available. Simmer tomatoes with garlic and salt for 15 minutes. Divide dough into 4 balls, stretch each into a round. Spread tomato sauce leaving a border, add mozzarella. Bake for 8-10 minutes until crust is charred and cheese bubbles. Top with fresh basil and a drizzle of olive oil.',
  4, 90, 15,
  ARRAY['Dinner', 'Italian', 'Vegetarian'],
  NULL
),
(
  'Vegetable Stir Fry',
  '2 tbsp vegetable oil
3 garlic cloves, minced
1 inch ginger, julienned
200g broccoli florets
1 red bell pepper, sliced
150g snap peas
150g mushrooms, sliced
2 tbsp soy sauce
1 tbsp oyster sauce
1 tsp sesame oil
1 tbsp cornstarch mixed with 2 tbsp water',
  'Heat oil in a wok over high heat. Add garlic and ginger, stir for 30 seconds. Add broccoli and stir-fry for 2 minutes. Add bell pepper, snap peas, and mushrooms. Continue stir-frying for 3-4 minutes until vegetables are crisp-tender. Add soy sauce and oyster sauce, toss to coat. Stir in cornstarch mixture and cook until sauce thickens. Drizzle with sesame oil and serve immediately over steamed rice.',
  4, 15, 10,
  ARRAY['Dinner', 'Quick', 'Vegetarian'],
  NULL
),
(
  'Beef Tacos',
  '500g beef mince
1 onion, diced
3 garlic cloves, minced
2 tbsp chilli powder
1 tbsp cumin
1 tsp paprika
8 small flour or corn tortillas
150g cheddar cheese, grated
Shredded lettuce
Diced tomatoes
Sour cream
Fresh coriander
Lime wedges',
  'Brown beef mince in a large pan over high heat, breaking it up as it cooks. Add onion and garlic, cook until softened. Stir in chilli powder, cumin, paprika, and a splash of water. Simmer for 5 minutes until flavours meld. Warm tortillas in a dry pan or microwave. Serve beef in tortillas topped with cheese, lettuce, tomatoes, sour cream, and coriander. Squeeze over lime juice before eating.',
  4, 10, 15,
  ARRAY['Dinner', 'Mexican', 'Quick'],
  NULL
)
ON CONFLICT DO NOTHING;
