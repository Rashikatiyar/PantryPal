/* ==============================================
   PantryPal AI – Recipe Preparation Agent
   app.js – all client-side logic
   ============================================== */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────
  const state = {
    ingredients: [],
    dietary: 'no-preference',
    time: 'any',
    difficulty: 'any',
  };

  // ── Recipe Database ────────────────────────────
  // Each recipe has: id, name, emoji, description, dietary[], time, difficulty,
  // keywords[], ingredients[], steps[], substitutions[], tip, dietaryAdjustment, wasteReductionTip
  const RECIPES = [
    // ── EXISTING RECIPES (kept intact) ────────────
    {
      id: 1,
      name: 'Classic Tomato Pasta',
      emoji: '🍝',
      description: 'A quick Italian-inspired pasta tossed in a fresh homemade tomato sauce — simple, satisfying and endlessly customisable.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 15,
      difficulty: 'easy',
      keywords: ['tomato', 'pasta', 'garlic', 'onion', 'basil', 'olive oil'],
      ingredients: ['200g pasta', '3 tomatoes, chopped', '2 garlic cloves', '1 tbsp olive oil', 'Salt & pepper', 'Fresh basil'],
      steps: ['Boil pasta as per package instructions.', 'Sauté garlic in olive oil for 1 min.', 'Add tomatoes, cook 5 mins until soft.', 'Toss drained pasta with sauce.', 'Season and garnish with basil.'],
      substitutions: ['No fresh basil? Use dried basil or oregano.', 'No olive oil? Any neutral cooking oil works.', 'No fresh tomatoes? Use canned chopped tomatoes.'],
      tip: 'Add a pinch of sugar to balance the acidity of the tomatoes.',
      dietaryAdjustment: 'Already vegan. Add grated Parmesan for a vegetarian upgrade.',
      wasteReductionTip: 'Use overripe tomatoes — they are sweeter and reduce food waste.',
    },
    {
      id: 2,
      name: 'Veggie Stir-Fry',
      emoji: '🥦',
      description: 'A vibrant, high-heat stir-fry packed with crunchy vegetables in a savoury soy-garlic sauce.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 20,
      difficulty: 'easy',
      keywords: ['broccoli', 'carrot', 'onion', 'bell pepper', 'capsicum', 'garlic', 'soy sauce', 'ginger', 'vegetables'],
      ingredients: ['1 cup broccoli florets', '1 carrot, sliced', '1 bell pepper', '2 tbsp soy sauce', '1 tsp sesame oil', 'Garlic & ginger'],
      steps: ['Heat oil in a wok over high heat.', 'Add garlic and ginger, stir 30 secs.', 'Add hard vegetables first (carrot, broccoli).', 'Add softer veggies and soy sauce.', 'Toss for 2–3 mins and serve hot.'],
      substitutions: ['No soy sauce? Use coconut aminos or a pinch of salt.', 'No broccoli? Use cabbage or cauliflower.', 'No sesame oil? Omit or use a few sesame seeds for flavour.'],
      tip: 'Keep the heat high for a proper stir-fry — don\'t let the veggies steam.',
      dietaryAdjustment: 'Fully vegan. Add tofu cubes for extra protein.',
      wasteReductionTip: 'Use any leftover vegetables in your fridge — this recipe is very forgiving.',
    },
    {
      id: 3,
      name: 'Egg Fried Rice',
      emoji: '🍚',
      description: 'A classic takeaway-style fried rice made at home in under 15 minutes using leftover rice and eggs.',
      dietary: ['no-preference', 'vegetarian'],
      time: 15,
      difficulty: 'easy',
      keywords: ['rice', 'egg', 'onion', 'garlic', 'soy sauce', 'peas', 'carrot'],
      ingredients: ['2 cups cooked rice', '2 eggs', '1 small onion', '2 garlic cloves', '2 tbsp soy sauce', '1 cup frozen peas'],
      steps: ['Heat oil in a pan, scramble eggs and set aside.', 'Sauté onion and garlic until golden.', 'Add rice, stir-fry on high heat.', 'Mix in soy sauce and peas.', 'Return eggs to pan, combine and serve.'],
      substitutions: ['No peas? Use corn, diced carrot, or any leftover vegetable.', 'No soy sauce? Use a little salt and a dash of vinegar.'],
      tip: 'Day-old rice works best — it fries better and doesn\'t clump.',
      dietaryAdjustment: 'Skip the egg and use tofu scramble to make it vegan.',
      wasteReductionTip: 'This recipe is specifically designed to use up leftover cooked rice.',
    },
    {
      id: 4,
      name: 'Creamy Mushroom Soup',
      emoji: '🍲',
      description: 'A rich and velvety mushroom soup that comes together in 30 minutes — perfect as a starter or a light meal.',
      dietary: ['no-preference', 'vegetarian'],
      time: 30,
      difficulty: 'easy',
      keywords: ['mushroom', 'onion', 'garlic', 'cream', 'butter', 'broth'],
      ingredients: ['300g mushrooms, sliced', '1 onion', '3 garlic cloves', '200ml cream', '2 tbsp butter', '500ml vegetable broth'],
      steps: ['Melt butter, sauté onion and garlic.', 'Add mushrooms, cook until golden.', 'Pour in broth, simmer 10 mins.', 'Blend half the soup for texture.', 'Stir in cream, season and serve.'],
      substitutions: ['No cream? Use coconut milk or milk with a tsp of flour to thicken.', 'No butter? Use olive oil.'],
      tip: 'Use a mix of mushroom varieties for a deeper flavour.',
      dietaryAdjustment: 'Use coconut cream and skip butter to make it vegan.',
      wasteReductionTip: 'Use mushrooms that are about to wilt — they\'re perfect for soup.',
    },
    {
      id: 5,
      name: 'Chicken Stir-Fry',
      emoji: '🍗',
      description: 'Tender sliced chicken with crisp peppers and onions in a quick soy-ginger glaze.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 25,
      difficulty: 'medium',
      keywords: ['chicken', 'bell pepper', 'capsicum', 'onion', 'garlic', 'soy sauce', 'ginger'],
      ingredients: ['300g chicken breast, sliced', '1 bell pepper', '1 onion', '2 tbsp soy sauce', '1 tsp cornstarch', 'Garlic & ginger'],
      steps: ['Marinate chicken with soy sauce and cornstarch.', 'Stir-fry chicken until cooked, set aside.', 'Sauté garlic, ginger, onion and pepper.', 'Return chicken to pan, toss together.', 'Serve over rice.'],
      substitutions: ['No cornstarch? Skip it — it just helps the sauce cling.', 'No bell pepper? Use any crunchy vegetable like zucchini or snap peas.'],
      tip: 'Slice chicken against the grain for a tender result.',
      dietaryAdjustment: 'Replace chicken with paneer or tofu for a vegetarian version.',
      wasteReductionTip: 'Use the leftover marinade as extra sauce — just bring to a boil first.',
    },
    {
      id: 6,
      name: 'Avocado Toast',
      emoji: '🥑',
      description: 'Creamy mashed avocado on golden toast — a nutritious and filling breakfast or snack in under 10 minutes.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 10,
      difficulty: 'easy',
      keywords: ['avocado', 'bread', 'lemon', 'tomato', 'onion', 'chilli'],
      ingredients: ['2 slices sourdough bread', '1 ripe avocado', '½ lemon', 'Chilli flakes', 'Salt & pepper', 'Cherry tomatoes'],
      steps: ['Toast the bread until golden.', 'Mash avocado with lemon juice and seasoning.', 'Spread avocado over toast.', 'Top with tomatoes and chilli flakes.', 'Serve immediately.'],
      substitutions: ['No sourdough? Use any bread you have.', 'No lemon? Use lime or a splash of vinegar.'],
      tip: 'A drizzle of good olive oil elevates this simple dish.',
      dietaryAdjustment: 'Already vegan. Add a poached egg on top for extra protein.',
      wasteReductionTip: 'Squeeze lemon over unused avocado to prevent browning and store in the fridge.',
    },
    {
      id: 7,
      name: 'Lentil Dal',
      emoji: '🫘',
      description: 'A warming, protein-rich Indian dal made with red lentils and aromatic spices.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 35,
      difficulty: 'medium',
      keywords: ['lentil', 'dal', 'tomato', 'onion', 'garlic', 'ginger', 'cumin', 'turmeric', 'rice'],
      ingredients: ['1 cup red lentils', '2 tomatoes, chopped', '1 onion', 'Garlic & ginger', '1 tsp cumin', '½ tsp turmeric'],
      steps: ['Rinse lentils and boil until soft.', 'Sauté onion, garlic, and ginger.', 'Add tomatoes and spices, cook 5 mins.', 'Combine with lentils, simmer 10 mins.', 'Adjust seasoning and serve with rice or naan.'],
      substitutions: ['No red lentils? Use yellow moong dal or split peas.', 'No fresh ginger? Use ½ tsp ground ginger.'],
      tip: 'Finish with a tadka (tempered spices in hot oil) poured on top.',
      dietaryAdjustment: 'Fully vegan as written. Serve with yoghurt for a vegetarian boost.',
      wasteReductionTip: 'Dal tastes even better the next day — make a big batch and refrigerate.',
    },
    {
      id: 8,
      name: 'Tuna Salad Bowl',
      emoji: '🥗',
      description: 'A light, protein-packed salad with canned tuna and fresh vegetables — ready in 10 minutes.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['tuna', 'cucumber', 'tomato', 'onion', 'lemon', 'lettuce', 'salad'],
      ingredients: ['1 can tuna, drained', '½ cucumber, diced', '2 tomatoes, chopped', '½ red onion, sliced', 'Juice of 1 lemon', 'Mixed lettuce leaves'],
      steps: ['Combine all vegetables in a bowl.', 'Flake tuna over the top.', 'Dress with lemon juice and olive oil.', 'Season with salt and pepper.', 'Toss gently and serve.'],
      substitutions: ['No tuna? Use canned chickpeas for a vegan version.', 'No lettuce? Use spinach or cabbage.'],
      tip: 'Rinse the canned tuna to reduce sodium.',
      dietaryAdjustment: 'Replace tuna with chickpeas for a vegan protein option.',
      wasteReductionTip: 'Use the leftover cucumber peel in a chutney or compost it.',
    },
    {
      id: 9,
      name: 'Banana Pancakes',
      emoji: '🥞',
      description: 'Fluffy, naturally sweet pancakes made with ripe bananas — a wholesome breakfast the whole family loves.',
      dietary: ['no-preference', 'vegetarian'],
      time: 15,
      difficulty: 'easy',
      keywords: ['banana', 'egg', 'flour', 'milk', 'butter', 'fruit'],
      ingredients: ['2 ripe bananas', '2 eggs', '½ cup flour', '¼ cup milk', '1 tsp baking powder', 'Butter for cooking'],
      steps: ['Mash bananas in a bowl.', 'Whisk in eggs and milk.', 'Fold in flour and baking powder.', 'Cook small portions in buttered pan over medium heat.', 'Flip when bubbles form; cook until golden.'],
      substitutions: ['No flour? Use oat flour or almond flour.', 'No milk? Use plant-based milk or water.', 'No eggs? Use 1 tbsp flaxseed + 3 tbsp water per egg.'],
      tip: 'The riper the banana, the sweeter and more flavourful your pancakes.',
      dietaryAdjustment: 'Use plant milk and flax eggs to make it vegan.',
      wasteReductionTip: 'This recipe is perfect for overripe bananas that are too soft to eat as-is.',
    },
    {
      id: 10,
      name: 'Garlic Butter Shrimp',
      emoji: '🍤',
      description: 'Juicy prawns sautéed in a fragrant garlic butter sauce — an elegant dish ready in 15 minutes.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 15,
      difficulty: 'easy',
      keywords: ['shrimp', 'prawn', 'garlic', 'butter', 'lemon', 'parsley'],
      ingredients: ['300g shrimp, peeled', '4 garlic cloves, minced', '3 tbsp butter', 'Juice of 1 lemon', 'Fresh parsley', 'Salt & pepper'],
      steps: ['Melt butter in a pan over medium-high heat.', 'Add garlic, sauté 1 min until fragrant.', 'Add shrimp, cook 2 mins per side.', 'Squeeze lemon juice over shrimp.', 'Garnish with parsley and serve.'],
      substitutions: ['No butter? Use olive oil for a lighter version.', 'No fresh parsley? Use dried parsley or coriander.'],
      tip: 'Don\'t overcrowd the pan — shrimp cook better in a single layer.',
      dietaryAdjustment: 'Not suitable for vegetarians. Try with paneer for a veggie twist.',
      wasteReductionTip: 'Save shrimp shells to make a quick flavourful seafood stock.',
    },
    {
      id: 11,
      name: 'Chickpea Curry',
      emoji: '🍛',
      description: 'A hearty, warming Indian-style chickpea curry with coconut milk — rich, satisfying, and fully plant-based.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 30,
      difficulty: 'medium',
      keywords: ['chickpea', 'tomato', 'onion', 'garlic', 'ginger', 'cumin', 'coconut milk', 'curry', 'spices'],
      ingredients: ['1 can chickpeas', '1 can coconut milk', '2 tomatoes', '1 onion', 'Garlic & ginger', '1 tsp cumin', '1 tsp garam masala'],
      steps: ['Sauté onion, garlic and ginger.', 'Add tomatoes and spices, cook 5 mins.', 'Pour in chickpeas and coconut milk.', 'Simmer 15 mins until thick.', 'Serve with rice or flatbread.'],
      substitutions: ['No coconut milk? Use 200ml fresh cream or yoghurt.', 'No canned chickpeas? Use boiled dried chickpeas (soak overnight first).'],
      tip: 'Add spinach in the last 2 minutes for extra nutrition.',
      dietaryAdjustment: 'Fully vegan. Add paneer chunks instead of spinach for a richer vegetarian version.',
      wasteReductionTip: 'Use the chickpea can liquid (aquafaba) as an egg replacer in baking.',
    },
    {
      id: 12,
      name: 'Greek Salad',
      emoji: '🥗',
      description: 'A refreshing Mediterranean salad with crisp vegetables, salty feta, and briny olives.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['cucumber', 'tomato', 'onion', 'feta', 'cheese', 'olive', 'lemon', 'salad'],
      ingredients: ['1 cucumber, diced', '3 tomatoes, chopped', '½ red onion', '100g feta cheese', 'Kalamata olives', 'Olive oil & oregano'],
      steps: ['Chop all vegetables into chunks.', 'Combine in a large bowl.', 'Add olives and crumbled feta.', 'Drizzle with olive oil.', 'Season with oregano, salt and serve.'],
      substitutions: ['No feta? Use paneer or cottage cheese.', 'No olives? Skip them or use capers for a similar briny flavour.'],
      tip: 'Let the salad rest 5 minutes so the juices blend.',
      dietaryAdjustment: 'Skip the feta and olives to make it vegan; add avocado for creaminess.',
      wasteReductionTip: 'Use the cucumber peels for a quick raita or chutney.',
    },

    // ── INDIAN RECIPES ─────────────────────────────
    {
      id: 13,
      name: 'Vegetable Fried Rice',
      emoji: '🍛',
      description: 'An Indo-Chinese style fried rice loaded with colourful vegetables — a quick one-pan meal.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 20,
      difficulty: 'easy',
      keywords: ['rice', 'carrot', 'peas', 'capsicum', 'bell pepper', 'onion', 'garlic', 'soy sauce', 'vegetables'],
      ingredients: ['2 cups cooked rice', '1 carrot, diced', '½ cup peas', '1 capsicum, diced', '1 onion, chopped', '2 tbsp soy sauce', '1 tsp oil', 'Salt & pepper'],
      steps: ['Heat oil in a wok on high flame.', 'Sauté onion, garlic for 2 mins.', 'Add carrot, peas and capsicum; stir-fry 3 mins.', 'Add cooked rice and soy sauce; toss well.', 'Season with salt & pepper, serve hot.'],
      substitutions: ['No soy sauce? Use a pinch of salt and black pepper.', 'No capsicum? Use spring onions or corn.'],
      tip: 'Use cold, day-old rice for the best non-sticky texture.',
      dietaryAdjustment: 'Fully vegan. Add scrambled egg for a vegetarian protein boost.',
      wasteReductionTip: 'This is a great way to use up leftover rice and any stray vegetables.',
    },
    {
      id: 14,
      name: 'Tomato Rice',
      emoji: '🍅',
      description: 'A South Indian-style tangy tomato rice spiced with mustard seeds and curry leaves — ready in 20 minutes.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 20,
      difficulty: 'easy',
      keywords: ['rice', 'tomato', 'onion', 'garlic', 'mustard', 'cumin', 'turmeric', 'curry leaves', 'spices'],
      ingredients: ['1½ cups cooked rice', '2 tomatoes, chopped', '1 onion, sliced', '1 tsp mustard seeds', '½ tsp turmeric', '1 tsp oil', 'Salt to taste', 'Curry leaves (optional)'],
      steps: ['Heat oil; add mustard seeds, let them splutter.', 'Add curry leaves, onion; sauté until golden.', 'Add tomatoes and turmeric; cook until mushy.', 'Fold in cooked rice, mix well.', 'Season with salt and serve.'],
      substitutions: ['No mustard seeds? Use cumin seeds.', 'No curry leaves? Use a bay leaf or skip.'],
      tip: 'A squeeze of lemon at the end brightens the flavour.',
      dietaryAdjustment: 'Fully vegan. Add fried peanuts on top for extra crunch and protein.',
      wasteReductionTip: 'Use overripe, soft tomatoes — they are ideal for this dish.',
    },
    {
      id: 15,
      name: 'Vegetable Sandwich',
      emoji: '🥪',
      description: 'A quick, filling sandwich stuffed with seasoned vegetables — great for breakfast or a light lunch.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['bread', 'tomato', 'onion', 'cucumber', 'potato', 'cheese', 'butter', 'vegetables'],
      ingredients: ['4 slices bread', '1 potato, boiled & sliced', '1 tomato, sliced', '½ cucumber, sliced', '1 onion, sliced', 'Butter', 'Salt, pepper & chaat masala'],
      steps: ['Butter both sides of each bread slice.', 'Layer potato, tomato, cucumber and onion.', 'Sprinkle chaat masala, salt and pepper.', 'Close the sandwich and toast on a pan until golden.', 'Serve with green chutney or ketchup.'],
      substitutions: ['No potato? Use mashed avocado or boiled beetroot.', 'No chaat masala? Use a pinch of cumin powder and salt.'],
      tip: 'Press the sandwich down with a spatula while toasting for an even golden crust.',
      dietaryAdjustment: 'Skip butter and use olive oil spray to make it vegan.',
      wasteReductionTip: 'Use slightly stale bread — toasting revives it perfectly.',
    },
    {
      id: 16,
      name: 'Masala Pasta',
      emoji: '🍝',
      description: 'An Indian-spiced pasta dish that blends Italian and Indian flavours in one bold, satisfying bowl.',
      dietary: ['no-preference', 'vegetarian'],
      time: 25,
      difficulty: 'easy',
      keywords: ['pasta', 'tomato', 'onion', 'garlic', 'capsicum', 'bell pepper', 'cumin', 'garam masala', 'vegetables', 'cheese'],
      ingredients: ['200g pasta', '2 tomatoes, chopped', '1 onion, chopped', '1 capsicum, diced', '2 garlic cloves', '½ tsp cumin', '½ tsp garam masala', 'Salt & oil'],
      steps: ['Boil pasta until al dente; drain and set aside.', 'Heat oil; sauté garlic and onion until soft.', 'Add capsicum and tomatoes; cook 5 mins.', 'Add spices; stir well for 1 min.', 'Toss in pasta, mix thoroughly and serve hot.'],
      substitutions: ['No garam masala? Use curry powder or just cumin and coriander.', 'No capsicum? Use peas or corn.'],
      tip: 'Add a spoon of butter at the end for a richer flavour.',
      dietaryAdjustment: 'Sprinkle grated cheese to make it a richer vegetarian meal.',
      wasteReductionTip: 'Save pasta cooking water — it helps loosen the sauce if needed.',
    },
    {
      id: 17,
      name: 'Poha',
      emoji: '🍽️',
      description: 'A classic Indian breakfast made with flattened rice, peas, and spices — light, healthy and ready in 15 minutes.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 15,
      difficulty: 'easy',
      keywords: ['poha', 'flattened rice', 'peas', 'onion', 'potato', 'mustard', 'turmeric', 'curry leaves', 'spices'],
      ingredients: ['2 cups poha (flattened rice)', '1 onion, chopped', '½ cup peas', '1 potato, boiled & diced', '1 tsp mustard seeds', '½ tsp turmeric', 'Oil & salt', 'Lemon juice'],
      steps: ['Rinse poha gently under water; let drain for 5 mins.', 'Heat oil; splutter mustard seeds and curry leaves.', 'Sauté onion until translucent.', 'Add potato, peas, turmeric and salt; mix.', 'Add poha, toss gently, squeeze lemon and serve.'],
      substitutions: ['No poha? Use puffed rice (murmura) for a similar dish.', 'No curry leaves? Skip or use a pinch of asafoetida.'],
      tip: 'Don\'t over-rinse poha or it will become mushy — a quick rinse is enough.',
      dietaryAdjustment: 'Fully vegan. Add roasted peanuts for crunch and protein.',
      wasteReductionTip: 'Leftover poha can be re-steamed with a sprinkle of water the next morning.',
    },
    {
      id: 18,
      name: 'Upma',
      emoji: '🫕',
      description: 'A hearty South Indian semolina breakfast porridge tempered with aromatic spices and mixed vegetables.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 20,
      difficulty: 'easy',
      keywords: ['semolina', 'rava', 'onion', 'tomato', 'peas', 'carrot', 'mustard', 'curry leaves', 'ginger', 'vegetables'],
      ingredients: ['1 cup semolina (rava)', '1 onion, chopped', '1 tomato, chopped', '½ cup mixed vegetables', '1 tsp mustard seeds', '1 tsp oil', '2 cups water', 'Salt to taste'],
      steps: ['Dry-roast semolina until light golden; set aside.', 'Heat oil; add mustard seeds, let them splutter.', 'Sauté onion, ginger and tomato until soft.', 'Add vegetables and water; bring to a boil.', 'Slowly stir in semolina; mix well, cover and cook 3 mins on low.'],
      substitutions: ['No semolina? Use broken wheat (dalia) with a longer cook time.', 'No fresh vegetables? Use frozen mixed vegetables.'],
      tip: 'Roasting the semolina first prevents lumps and adds a nutty flavour.',
      dietaryAdjustment: 'Fully vegan. Add a handful of cashews while tempering for richness.',
      wasteReductionTip: 'Leftover upma can be shaped into patties and pan-fried for a crunchy snack.',
    },
    {
      id: 19,
      name: 'Vegetable Pulao',
      emoji: '🍚',
      description: 'A fragrant, lightly spiced one-pot rice dish loaded with mixed vegetables — an easy and impressive meal.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 30,
      difficulty: 'medium',
      keywords: ['rice', 'vegetables', 'peas', 'carrot', 'potato', 'onion', 'garlic', 'ginger', 'cumin', 'bay leaf', 'spices'],
      ingredients: ['1½ cups basmati rice', '1 cup mixed vegetables (carrot, peas, potato)', '1 onion, sliced', 'Garlic & ginger paste', '1 tsp cumin', '2 bay leaves', '1 tbsp oil', 'Salt to taste'],
      steps: ['Wash and soak rice for 20 mins; drain.', 'Heat oil; fry cumin and bay leaves for 30 secs.', 'Sauté onion and garlic-ginger paste until golden.', 'Add vegetables and sauté 3 mins.', 'Add rice, 3 cups water and salt; cover and cook on low until done.'],
      substitutions: ['No basmati? Any long-grain rice works.', 'No fresh vegetables? Use frozen peas and canned corn.'],
      tip: 'Fluff the rice gently with a fork after cooking — don\'t stir or it will become mushy.',
      dietaryAdjustment: 'Fully vegan. Serve with yoghurt raita for a vegetarian accompaniment.',
      wasteReductionTip: 'Use vegetable peel water as part of the cooking liquid for extra nutrients.',
    },
    {
      id: 20,
      name: 'Aloo Sabzi',
      emoji: '🥔',
      description: 'A simple, comforting dry Indian potato curry seasoned with cumin and spices — pairs beautifully with roti or rice.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 20,
      difficulty: 'easy',
      keywords: ['potato', 'aloo', 'onion', 'tomato', 'garlic', 'cumin', 'turmeric', 'coriander', 'spices'],
      ingredients: ['4 medium potatoes, boiled & cubed', '1 onion, chopped', '1 tomato, chopped', '1 tsp cumin seeds', '½ tsp turmeric', '1 tsp coriander powder', 'Oil & salt', 'Fresh coriander to garnish'],
      steps: ['Heat oil; splutter cumin seeds.', 'Sauté onion until golden, then add tomato.', 'Add turmeric and coriander powder; cook 2 mins.', 'Add potatoes, mix well and cook 5 mins.', 'Garnish with fresh coriander and serve.'],
      substitutions: ['No coriander powder? Use garam masala.', 'No fresh coriander? Use parsley or skip.'],
      tip: 'Slightly crush a few potato pieces to absorb the masala flavours.',
      dietaryAdjustment: 'Fully vegan. Stir in a tablespoon of yoghurt for a creamier vegetarian version.',
      wasteReductionTip: 'Use any potatoes that are going soft — they are ideal for this recipe.',
    },
    {
      id: 21,
      name: 'Dal Rice',
      emoji: '🍱',
      description: 'The ultimate Indian comfort food — simple yellow dal served over steamed rice, warm and nourishing.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 35,
      difficulty: 'easy',
      keywords: ['dal', 'lentil', 'rice', 'onion', 'tomato', 'garlic', 'turmeric', 'cumin', 'spices'],
      ingredients: ['1 cup yellow moong dal', '1½ cups rice', '1 onion, chopped', '1 tomato, chopped', '1 tsp cumin', '½ tsp turmeric', 'Garlic cloves', 'Oil & salt'],
      steps: ['Cook rice until fluffy; set aside.', 'Boil dal with turmeric and salt until soft.', 'Heat oil; fry cumin and garlic until golden.', 'Add onion and tomato; sauté 5 mins.', 'Pour the tempering over dal, stir and serve with rice.'],
      substitutions: ['No moong dal? Use masoor dal (red lentils).', 'No garlic? Use asafoetida (hing) for a similar flavour.'],
      tip: 'A generous dollop of ghee on hot dal rice makes it absolutely divine.',
      dietaryAdjustment: 'Fully vegan (use oil instead of ghee). Add ghee and serve with yoghurt for a vegetarian treat.',
      wasteReductionTip: 'Dal thickens on standing — add a splash of water and reheat for next day\'s meal.',
    },
    {
      id: 22,
      name: 'Besan Chilla',
      emoji: '🫓',
      description: 'Savoury Indian chickpea flour pancakes — thin, crispy, protein-rich and ready in 15 minutes.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 15,
      difficulty: 'easy',
      keywords: ['besan', 'chickpea flour', 'onion', 'tomato', 'capsicum', 'bell pepper', 'ginger', 'cumin', 'flour', 'vegetables'],
      ingredients: ['1 cup besan (chickpea flour)', '1 onion, finely chopped', '1 tomato, finely chopped', '½ capsicum, chopped', '½ tsp cumin', '¼ tsp turmeric', 'Water to make batter', 'Oil for cooking'],
      steps: ['Mix besan, vegetables and spices in a bowl.', 'Add water gradually to make a smooth, pourable batter.', 'Heat a non-stick pan; grease lightly.', 'Pour a ladleful of batter; spread in a circle.', 'Cook on medium heat until golden; flip and cook the other side.'],
      substitutions: ['No besan? Use whole wheat flour for a different but similar pancake.', 'No capsicum? Use grated carrot or zucchini.'],
      tip: 'The batter should be thin — similar consistency to crepe batter.',
      dietaryAdjustment: 'Fully vegan. Serve with yoghurt chutney for a vegetarian pairing.',
      wasteReductionTip: 'Left over batter can be refrigerated for up to 24 hours.',
    },

    // ── QUICK RECIPES ──────────────────────────────
    {
      id: 23,
      name: 'Omelette',
      emoji: '🍳',
      description: 'A classic fluffy omelette — endlessly versatile, filling and ready in 5 minutes.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['egg', 'onion', 'tomato', 'capsicum', 'bell pepper', 'cheese', 'butter', 'milk'],
      ingredients: ['3 eggs', '2 tbsp milk', '½ onion, chopped', '½ tomato, chopped', 'Salt & pepper', '1 tsp butter or oil'],
      steps: ['Beat eggs with milk, salt and pepper.', 'Heat butter in a pan over medium heat.', 'Add onion and tomato; stir 1 min.', 'Pour beaten eggs over vegetables.', 'Cook until set; fold and serve.'],
      substitutions: ['No milk? Skip it — the eggs will still work.', 'No butter? Use any oil.'],
      tip: 'Don\'t over-stir the eggs while they cook for a soft, custardy texture.',
      dietaryAdjustment: 'Vegetarian as written. Not suitable for vegans — use silken tofu scramble instead.',
      wasteReductionTip: 'Add any fridge scraps — leftover vegetables, small cheese pieces — to the filling.',
    },
    {
      id: 24,
      name: 'Scrambled Eggs',
      emoji: '🍳',
      description: 'Soft, creamy scrambled eggs — a protein-rich breakfast ready in under 10 minutes.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['egg', 'butter', 'milk', 'cheese', 'onion', 'tomato'],
      ingredients: ['3 eggs', '1 tbsp butter', '2 tbsp milk', 'Salt & pepper', 'Fresh herbs (optional)'],
      steps: ['Crack eggs into a bowl with milk; whisk well.', 'Melt butter in a pan on low-medium heat.', 'Pour in eggs; stir gently with a spatula.', 'Cook slowly, pulling eggs from the edges.', 'Remove from heat while still slightly soft; serve immediately.'],
      substitutions: ['No milk? Skip for a richer, creamier result.', 'No butter? Use olive oil but the flavour will differ.'],
      tip: 'Low and slow is the secret — scrambled eggs should never be rushed.',
      dietaryAdjustment: 'Vegetarian. Not suitable for vegans.',
      wasteReductionTip: 'Use eggs that are close to their best-before date first.',
    },
    {
      id: 25,
      name: 'Instant Noodles',
      emoji: '🍜',
      description: 'Elevated instant noodles with fresh vegetables and egg — a satisfying meal in under 10 minutes.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['noodles', 'egg', 'onion', 'carrot', 'capsicum', 'bell pepper', 'garlic', 'soy sauce', 'vegetables'],
      ingredients: ['1 pack instant noodles', '1 egg', '½ onion, sliced', '1 small carrot, julienned', '½ capsicum, sliced', '1 tsp soy sauce', '1 tsp oil'],
      steps: ['Boil noodles as per packet instructions; drain.', 'Heat oil; sauté onion, carrot and capsicum 2 mins.', 'Push veggies aside; scramble egg in the pan.', 'Add noodles and soy sauce; toss everything together.', 'Add seasoning packet to taste; serve hot.'],
      substitutions: ['No egg? Skip or add tofu instead.', 'No fresh vegetables? Use frozen mixed vegetables.'],
      tip: 'Use only half the seasoning packet to control sodium.',
      dietaryAdjustment: 'Skip egg to make it vegan (check seasoning packet for animal products).',
      wasteReductionTip: 'Noodle cooking water can be used as a quick soup base.',
    },
    {
      id: 26,
      name: 'Cheese Sandwich',
      emoji: '🧀',
      description: 'A warm, melty cheese sandwich toasted to golden perfection — the ultimate quick comfort food.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['bread', 'cheese', 'butter', 'tomato', 'onion'],
      ingredients: ['2 slices bread', '2–3 slices cheese', '1 tbsp butter', '½ tomato, sliced (optional)', 'Salt & pepper'],
      steps: ['Butter one side of each bread slice.', 'Place cheese (and tomato) on the unbuttered side.', 'Close the sandwich with buttered sides out.', 'Toast on a pan over medium heat until golden.', 'Flip carefully, toast the other side and serve.'],
      substitutions: ['No cheese slices? Grate any hard cheese you have.', 'No butter? Use olive oil or cooking spray.'],
      tip: 'Cover the pan with a lid while toasting — the trapped heat melts the cheese faster.',
      dietaryAdjustment: 'Already vegetarian. Not vegan. Use plant-based cheese for a vegan version.',
      wasteReductionTip: 'Use bread that\'s slightly stale — it toasts better and doesn\'t go to waste.',
    },
    {
      id: 27,
      name: 'Vegetable Wrap',
      emoji: '🌯',
      description: 'A fresh and filling wrap stuffed with sautéed vegetables and a creamy spread — a healthy grab-and-go meal.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 15,
      difficulty: 'easy',
      keywords: ['bread', 'flour', 'capsicum', 'bell pepper', 'onion', 'carrot', 'tomato', 'cheese', 'vegetables'],
      ingredients: ['2 large tortillas or flatbreads', '1 capsicum, sliced', '1 carrot, grated', '½ onion, sliced', '1 tomato, sliced', '2 tbsp hummus or cream cheese', 'Salt, pepper & mixed herbs'],
      steps: ['Warm the tortilla in a dry pan for 30 secs.', 'Spread hummus or cream cheese on the wrap.', 'Sauté capsicum and onion in oil for 3 mins.', 'Layer vegetables and tomato on the wrap.', 'Season, roll tightly and serve immediately.'],
      substitutions: ['No tortilla? Use any flatbread or large chapati.', 'No hummus? Use any spread — mayo, guacamole, or yoghurt sauce.'],
      tip: 'Warm the wrap first so it folds without cracking.',
      dietaryAdjustment: 'Use hummus to keep it vegan. Add cheese or egg for a heartier vegetarian version.',
      wasteReductionTip: 'Wraps are ideal for using up leftover roasted or raw vegetables.',
    },

    // ── HEALTHY RECIPES ────────────────────────────
    {
      id: 28,
      name: 'Oats Bowl',
      emoji: '🥣',
      description: 'A warm, creamy oats bowl loaded with fruit and nuts — a nutritious start to your day.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['oats', 'milk', 'banana', 'fruit', 'honey', 'nuts'],
      ingredients: ['1 cup rolled oats', '1½ cups milk or water', '1 banana, sliced', '1 tbsp honey', 'Handful of nuts', 'Pinch of cinnamon'],
      steps: ['Bring milk to a gentle simmer in a saucepan.', 'Stir in oats; cook on medium heat for 5 mins, stirring often.', 'Add cinnamon and honey; mix well.', 'Pour into a bowl and top with banana and nuts.', 'Serve immediately.'],
      substitutions: ['No milk? Use water or any plant-based milk.', 'No honey? Use maple syrup or jaggery.'],
      tip: 'Soak oats overnight to reduce cooking time to 2 minutes in the morning.',
      dietaryAdjustment: 'Use plant milk and maple syrup to make it fully vegan.',
      wasteReductionTip: 'Overripe bananas are perfect as a topping — they are naturally sweeter.',
    },
    {
      id: 29,
      name: 'Vegetable Salad',
      emoji: '🥗',
      description: 'A crunchy, colourful mixed vegetable salad with a light lemon dressing — fresh and nutritious.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 10,
      difficulty: 'easy',
      keywords: ['cucumber', 'tomato', 'carrot', 'onion', 'capsicum', 'bell pepper', 'lemon', 'vegetables', 'salad'],
      ingredients: ['1 cucumber, diced', '2 tomatoes, chopped', '1 carrot, grated', '½ capsicum, diced', '½ onion, sliced', 'Juice of 1 lemon', 'Salt, pepper & herbs'],
      steps: ['Dice and combine all vegetables in a large bowl.', 'Drizzle with lemon juice.', 'Add salt, pepper, and herbs.', 'Toss well to combine.', 'Serve fresh or chill for 10 mins.'],
      substitutions: ['No lemon? Use apple cider vinegar or lime.', 'No capsicum? Use spring onions or radish.'],
      tip: 'Chill the salad for 10 minutes before serving for the best flavour.',
      dietaryAdjustment: 'Fully vegan. Add feta cheese for a vegetarian Mediterranean variation.',
      wasteReductionTip: 'Use vegetable trimmings and slightly soft vegetables — they\'re perfect here.',
    },
    {
      id: 30,
      name: 'Fruit Bowl',
      emoji: '🍓',
      description: 'A vibrant, refreshing bowl of mixed seasonal fruits — a no-cook healthy snack or breakfast.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 5,
      difficulty: 'easy',
      keywords: ['banana', 'apple', 'fruit', 'mango', 'grapes', 'pomegranate', 'lemon', 'honey'],
      ingredients: ['1 banana, sliced', '1 apple, diced', '½ cup grapes', '½ cup any seasonal fruit', 'Juice of ½ lemon', '1 tsp honey or jaggery (optional)'],
      steps: ['Wash and chop all fruits into bite-sized pieces.', 'Combine in a bowl.', 'Squeeze lemon juice over the top.', 'Drizzle honey if desired.', 'Toss gently and serve.'],
      substitutions: ['Use any seasonal fruits you have.', 'No honey? The fruit is naturally sweet — skip it.'],
      tip: 'Lemon juice keeps the fruit fresh and prevents browning.',
      dietaryAdjustment: 'Fully vegan. Add a spoonful of yoghurt on top for a vegetarian twist.',
      wasteReductionTip: 'Use overripe soft fruits — they are sweeter and reduce waste.',
    },
    {
      id: 31,
      name: 'Sprouts Salad',
      emoji: '🌱',
      description: 'A light, protein-rich Indian sprouts salad with lemon and spices — a healthy snack or starter.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 10,
      difficulty: 'easy',
      keywords: ['sprouts', 'tomato', 'onion', 'cucumber', 'lemon', 'carrot', 'vegetables', 'salad'],
      ingredients: ['1½ cups mixed sprouts (moong, chana)', '1 tomato, chopped', '½ onion, finely chopped', '½ cucumber, diced', '1 carrot, grated', 'Juice of 1 lemon', 'Salt, cumin powder & fresh coriander'],
      steps: ['Rinse sprouts well under running water.', 'Combine sprouts with all chopped vegetables.', 'Add lemon juice, salt and cumin powder.', 'Toss well and top with fresh coriander.', 'Serve immediately or chill for 5 mins.'],
      substitutions: ['No sprouts? Use boiled chickpeas or kidney beans.', 'No coriander? Use mint leaves.'],
      tip: 'Steam sprouts for 2–3 minutes if you prefer a softer texture.',
      dietaryAdjustment: 'Fully vegan. Add a dollop of yoghurt for a creamy vegetarian dressing.',
      wasteReductionTip: 'Sprout your own moong beans at home — just soak overnight and rinse daily.',
    },

    // ── NEW VEG RECIPES ────────────────────────────
    {
      id: 32,
      name: 'Paneer Bhurji',
      emoji: '🧀',
      description: 'Crumbled cottage cheese scrambled with onions, tomatoes and spices — a quick, protein-rich Indian side or filling.',
      dietary: ['no-preference', 'vegetarian'],
      time: 15,
      difficulty: 'easy',
      keywords: ['paneer', 'cottage cheese', 'onion', 'tomato', 'capsicum', 'bell pepper', 'garlic', 'ginger', 'cumin', 'turmeric', 'spices'],
      ingredients: ['250g paneer, crumbled', '1 onion, finely chopped', '2 tomatoes, chopped', '½ capsicum, diced', '2 garlic cloves, minced', '½ tsp turmeric', '1 tsp cumin', 'Oil & salt', 'Fresh coriander'],
      steps: ['Heat oil; sauté garlic and onion until golden.', 'Add capsicum; cook 2 mins.', 'Add tomatoes, turmeric, cumin and salt; cook until soft.', 'Crumble in paneer; mix and cook 3–4 mins on medium heat.', 'Garnish with coriander; serve with roti or bread.'],
      substitutions: ['No paneer? Use firm tofu for a vegan version.', 'No capsicum? Use peas or corn.'],
      tip: 'Don\'t over-cook the paneer or it turns rubbery — just heat it through.',
      dietaryAdjustment: 'Use firm tofu and vegan butter to make it fully vegan.',
      wasteReductionTip: 'Use paneer that is a day old — it holds its shape better when crumbled.',
    },
    {
      id: 33,
      name: 'Rajma Chawal',
      emoji: '🫘',
      description: 'Hearty North Indian kidney bean curry served over steamed rice — the ultimate weekday comfort meal.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 40,
      difficulty: 'medium',
      keywords: ['rajma', 'kidney beans', 'rice', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'garam masala', 'spices'],
      ingredients: ['1 can kidney beans (rajma)', '1½ cups rice', '1 onion, chopped', '2 tomatoes, chopped', 'Garlic & ginger paste', '1 tsp cumin', '1 tsp garam masala', '½ tsp turmeric', 'Oil & salt'],
      steps: ['Cook rice; set aside.', 'Heat oil; sauté cumin, onion and garlic-ginger paste until golden.', 'Add tomatoes, turmeric and garam masala; cook 8 mins until thick.', 'Add kidney beans with a splash of water; simmer 12 mins.', 'Mash a few beans to thicken the gravy; serve over rice.'],
      substitutions: ['No canned beans? Use boiled dried kidney beans (soak overnight).', 'No garam masala? Use chole masala or curry powder.'],
      tip: 'Rajma tastes even better the next day — the flavours deepen overnight.',
      dietaryAdjustment: 'Fully vegan. Stir in a spoonful of cream for a richer vegetarian version.',
      wasteReductionTip: 'Reserve the bean cooking water to add body to the gravy.',
    },
    {
      id: 34,
      name: 'Palak Paneer',
      emoji: '🥬',
      description: 'Tender paneer cubes in a silky, spiced spinach gravy — a North Indian classic that is as nutritious as it is delicious.',
      dietary: ['no-preference', 'vegetarian'],
      time: 30,
      difficulty: 'medium',
      keywords: ['spinach', 'palak', 'paneer', 'onion', 'tomato', 'garlic', 'ginger', 'cream', 'cumin', 'spices'],
      ingredients: ['200g paneer, cubed', '3 cups fresh spinach', '1 onion, chopped', '1 tomato, chopped', 'Garlic & ginger', '½ tsp cumin', '2 tbsp cream', 'Oil & salt'],
      steps: ['Blanch spinach in boiling water 2 mins; drain and blend smooth.', 'Heat oil; sauté garlic, ginger and onion until golden.', 'Add tomato and cumin; cook until soft.', 'Stir in spinach puree; simmer 5 mins.', 'Add paneer cubes and cream; cook 3 mins and serve.'],
      substitutions: ['No fresh spinach? Use frozen spinach — thaw and blend.', 'No cream? Use cashew paste or coconut milk.'],
      tip: 'Add a tiny pinch of sugar to balance the bitterness of spinach.',
      dietaryAdjustment: 'Replace paneer with firm tofu and cream with coconut milk for a vegan version.',
      wasteReductionTip: 'Blanching water from spinach is nutritious — use it as a soup base.',
    },
    {
      id: 35,
      name: 'Mixed Vegetable Curry',
      emoji: '🥘',
      description: 'A versatile, colourful curry made with whatever vegetables you have — simple, warming and endlessly adaptable.',
      dietary: ['no-preference', 'vegetarian', 'vegan'],
      time: 25,
      difficulty: 'easy',
      keywords: ['potato', 'carrot', 'peas', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'turmeric', 'vegetables', 'curry'],
      ingredients: ['2 potatoes, diced', '1 carrot, sliced', '½ cup peas', '1 onion, chopped', '1 tomato, chopped', 'Garlic & ginger', '1 tsp cumin', '½ tsp turmeric', '1 tsp coriander powder', 'Oil & salt'],
      steps: ['Heat oil; sauté cumin, garlic and onion until golden.', 'Add tomato, turmeric and coriander powder; cook 4 mins.', 'Add potato and carrot with ½ cup water; cover and cook 10 mins.', 'Add peas; cook another 5 mins until vegetables are tender.', 'Adjust seasoning and serve with rice or roti.'],
      substitutions: ['Use any vegetables you have — capsicum, beans, cauliflower all work.', 'No coriander powder? Use garam masala.'],
      tip: 'Cut all vegetables to a similar size so they cook evenly.',
      dietaryAdjustment: 'Fully vegan. Add a spoon of ghee at the end for a vegetarian flavour boost.',
      wasteReductionTip: 'This curry is designed for vegetables that need to be used up quickly.',
    },
    {
      id: 36,
      name: 'Masala Omelette',
      emoji: '🍳',
      description: 'A spiced Indian-style omelette loaded with onion, tomato and green chilli — street-food flavour in 10 minutes.',
      dietary: ['no-preference', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      keywords: ['egg', 'onion', 'tomato', 'capsicum', 'bell pepper', 'chilli', 'coriander', 'cumin', 'butter', 'milk'],
      ingredients: ['3 eggs', '1 small onion, finely chopped', '1 tomato, chopped', '1 green chilli, chopped', '¼ tsp cumin', 'Fresh coriander', 'Salt & oil'],
      steps: ['Beat eggs well with salt and cumin.', 'Heat oil in a pan; sauté onion, tomato and chilli 2 mins.', 'Pour beaten eggs over the vegetables.', 'Sprinkle coriander on top; cook on medium until set.', 'Fold and serve with bread or chutney.'],
      substitutions: ['No green chilli? Use chilli flakes or black pepper.', 'No coriander? Use parsley or spring onion tops.'],
      tip: 'Covering the pan for the last minute gives a perfectly set top without flipping.',
      dietaryAdjustment: 'Vegetarian only. Not suitable for vegans.',
      wasteReductionTip: 'Add any leftover cooked vegetables into the egg mixture to clear the fridge.',
    },
    {
      id: 37,
      name: 'Aloo Paratha',
      emoji: '🫓',
      description: 'Golden, crispy whole-wheat flatbread stuffed with spiced mashed potato — a beloved Indian breakfast.',
      dietary: ['no-preference', 'vegetarian'],
      time: 30,
      difficulty: 'medium',
      keywords: ['potato', 'flour', 'onion', 'garlic', 'cumin', 'coriander', 'butter', 'oil', 'spices'],
      ingredients: ['2 cups whole wheat flour', '3 potatoes, boiled & mashed', '1 small onion, grated', '½ tsp cumin seeds', '½ tsp coriander powder', 'Fresh coriander', 'Salt & water', 'Butter for cooking'],
      steps: ['Mix flour, salt and water to make a soft dough; rest 15 mins.', 'Combine mashed potato, onion, cumin, coriander and salt for filling.', 'Roll dough into small circles; place filling in centre.', 'Seal edges, roll gently into flat circles.', 'Cook on a hot pan with butter until golden on both sides.'],
      substitutions: ['No whole wheat flour? Use plain flour (maida).', 'No butter? Use ghee or oil.'],
      tip: 'Seal the edges well before rolling to prevent the filling from leaking.',
      dietaryAdjustment: 'Use oil instead of butter to make it vegan.',
      wasteReductionTip: 'Perfect way to use up leftover mashed potatoes from a previous meal.',
    },

    // ── NEW NON-VEG RECIPES ────────────────────────
    {
      id: 38,
      name: 'Egg Curry',
      emoji: '🥚',
      description: 'Hard-boiled eggs simmered in a rich, spiced onion-tomato gravy — a satisfying Indian curry ready in 25 minutes.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 25,
      difficulty: 'easy',
      keywords: ['egg', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'turmeric', 'garam masala', 'spices'],
      ingredients: ['4 eggs, hard-boiled & peeled', '1 onion, chopped', '2 tomatoes, chopped', 'Garlic & ginger paste', '1 tsp cumin', '½ tsp turmeric', '1 tsp garam masala', 'Oil & salt'],
      steps: ['Heat oil; sauté cumin, onion and garlic-ginger paste until brown.', 'Add tomatoes, turmeric and garam masala; cook until oil separates.', 'Add ½ cup water; simmer 5 mins to make a thick gravy.', 'Score the boiled eggs and add to the gravy.', 'Simmer 5 more mins; serve with rice or roti.'],
      substitutions: ['No fresh tomatoes? Use 2 tbsp tomato paste with a little water.', 'No garam masala? Use curry powder.'],
      tip: 'Scoring the eggs lets the gravy seep in for more flavour.',
      dietaryAdjustment: 'Not suitable for vegetarians or vegans.',
      wasteReductionTip: 'Use eggs that are close to their expiry date — boiling extends their life.',
    },
    {
      id: 39,
      name: 'Chicken Curry',
      emoji: '🍛',
      description: 'A classic, aromatic Indian chicken curry with a rich tomato-onion gravy — perfect with rice or naan.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 40,
      difficulty: 'medium',
      keywords: ['chicken', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'turmeric', 'garam masala', 'coriander', 'spices'],
      ingredients: ['500g chicken, cut into pieces', '1 onion, finely chopped', '2 tomatoes, chopped', 'Garlic & ginger paste', '1 tsp cumin', '½ tsp turmeric', '1 tsp garam masala', '1 tsp coriander powder', 'Oil & salt'],
      steps: ['Heat oil; fry onion until deep golden.', 'Add garlic-ginger paste; fry 2 mins.', 'Add tomatoes and all spices; cook until oil separates.', 'Add chicken pieces; sear on high heat 3 mins.', 'Add ½ cup water; cover and cook on medium 20 mins until chicken is done.'],
      substitutions: ['No fresh garlic? Use ½ tsp garlic powder.', 'No coriander powder? Use extra garam masala.'],
      tip: 'Fry the onion until truly golden-brown — this is the flavour base of the entire curry.',
      dietaryAdjustment: 'Not suitable for vegetarians. Replace chicken with chickpeas for a vegan version.',
      wasteReductionTip: 'Use the chicken carcass or bones to make a quick stock for soups.',
    },
    {
      id: 40,
      name: 'Keema Matar',
      emoji: '🥩',
      description: 'Spiced minced meat cooked with green peas in a dry, flavourful masala — a quick and hearty Indian classic.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 30,
      difficulty: 'medium',
      keywords: ['minced meat', 'keema', 'peas', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'garam masala', 'spices'],
      ingredients: ['400g minced chicken or mutton', '1 cup peas', '1 onion, chopped', '2 tomatoes, chopped', 'Garlic & ginger paste', '1 tsp cumin', '1 tsp garam masala', '½ tsp turmeric', 'Oil & salt'],
      steps: ['Heat oil; sauté cumin, onion and garlic-ginger paste until golden.', 'Add tomatoes and spices; cook 5 mins.', 'Add minced meat; cook on high heat breaking any lumps.', 'Cook until the meat is dry and browned — about 10 mins.', 'Add peas and a splash of water; cover and cook 8 mins.'],
      substitutions: ['No minced meat? Use crumbled paneer or soya granules for a vegetarian version.', 'No peas? Use diced carrot or corn.'],
      tip: 'Cook the keema on high heat until completely dry before adding peas — this adds depth.',
      dietaryAdjustment: 'Use soya granules or crumbled paneer to adapt for vegetarians.',
      wasteReductionTip: 'Leftover keema makes an excellent sandwich or paratha filling.',
    },
    {
      id: 41,
      name: 'Fish Fry',
      emoji: '🐟',
      description: 'Crispy spiced pan-fried fish — a quick, flavour-packed dish ready in under 20 minutes.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 20,
      difficulty: 'easy',
      keywords: ['fish', 'garlic', 'lemon', 'cumin', 'turmeric', 'chilli', 'flour', 'oil', 'spices'],
      ingredients: ['4 fish fillets', '1 tsp turmeric', '1 tsp cumin powder', '1 tsp chilli powder', '1 tbsp lemon juice', '2 tbsp flour', 'Garlic paste', 'Oil for frying', 'Salt'],
      steps: ['Mix turmeric, cumin, chilli, garlic, lemon juice and salt into a paste.', 'Coat fish fillets evenly; marinate 10 mins.', 'Dust lightly with flour for a crispy crust.', 'Heat oil in a pan; fry fish 3–4 mins per side until golden.', 'Drain on paper; serve with lemon wedges and chutney.'],
      substitutions: ['No fish fillets? Use fish steaks or prawns.', 'No flour? Use semolina (rava) for an even crunchier coating.'],
      tip: 'Pat the fish dry before marinating — moisture prevents crisping.',
      dietaryAdjustment: 'Not suitable for vegetarians. Use the same marinade on paneer for a veg version.',
      wasteReductionTip: 'Fish trimmings can be used to make a quick fish stock.',
    },
    {
      id: 42,
      name: 'Chicken Fried Rice',
      emoji: '🍗',
      description: 'Restaurant-style chicken fried rice loaded with vegetables and egg — a complete one-pan meal in 20 minutes.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 20,
      difficulty: 'easy',
      keywords: ['rice', 'chicken', 'egg', 'carrot', 'peas', 'onion', 'garlic', 'soy sauce', 'capsicum', 'bell pepper'],
      ingredients: ['2 cups cooked rice', '150g chicken breast, diced small', '1 egg', '1 carrot, diced', '½ cup peas', '1 onion, chopped', '2 tbsp soy sauce', 'Garlic', 'Oil & pepper'],
      steps: ['Heat oil on high; stir-fry chicken until cooked — about 5 mins; set aside.', 'In same pan, sauté garlic and onion 1 min.', 'Add carrot and peas; stir-fry 3 mins.', 'Push aside; scramble egg in the pan.', 'Add rice, soy sauce and chicken; toss everything together and serve.'],
      substitutions: ['No chicken? Skip for a veggie fried rice.', 'No soy sauce? Use a pinch of salt and vinegar.'],
      tip: 'Use day-old refrigerated rice — fresh rice is too moist and turns mushy.',
      dietaryAdjustment: 'Skip chicken and egg to make a vegan fried rice.',
      wasteReductionTip: 'Great use for leftover rice and any vegetable scraps.',
    },
    {
      id: 43,
      name: 'Mutton/Chicken Soup',
      emoji: '🍜',
      description: 'A warming, nourishing clear broth with tender meat and vegetables — simple to make and deeply satisfying.',
      dietary: ['no-preference', 'non-vegetarian'],
      time: 40,
      difficulty: 'medium',
      keywords: ['chicken', 'mutton', 'carrot', 'onion', 'garlic', 'ginger', 'peas', 'potato', 'broth', 'spices'],
      ingredients: ['300g chicken or mutton pieces', '1 carrot, sliced', '1 potato, diced', '1 onion, quartered', '4 garlic cloves', '1 inch ginger', '½ tsp turmeric', '½ tsp pepper', 'Salt & fresh coriander'],
      steps: ['Add meat, onion, garlic, ginger, turmeric and 4 cups water to a pot.', 'Bring to a boil; skim any foam.', 'Add carrot and potato; reduce heat and simmer 25 mins.', 'Season with salt and pepper.', 'Garnish with fresh coriander and serve hot.'],
      substitutions: ['No fresh ginger? Use ½ tsp ground ginger.', 'No potato? Use sweet potato or skip.'],
      tip: 'Simmer gently rather than boiling hard — it keeps the broth clear and the meat tender.',
      dietaryAdjustment: 'Not suitable for vegetarians. Use only vegetables and chickpeas for a vegan broth.',
      wasteReductionTip: 'Strain and freeze any leftover broth as an instant soup base for later.',
    },
  ];

  // ── localStorage helpers ─────────────────────────
  var LS_FAVS    = 'pantrypal_favorites';
  var LS_RECENT  = 'pantrypal_recent_searches';
  var MAX_RECENT = 8;

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  // ── Favorites state ──────────────────────────────
  // Stored as array of recipe ids (numbers)
  function getFavIds()        { return lsGet(LS_FAVS); }
  function isFav(id)          { return getFavIds().indexOf(id) !== -1; }
  function toggleFav(id) {
    var ids = getFavIds();
    var idx = ids.indexOf(id);
    if (idx === -1) { ids.push(id); } else { ids.splice(idx, 1); }
    lsSet(LS_FAVS, ids);
  }

  // ── Recent Searches state ────────────────────────
  // Each entry: { ingredients: [], dietary, time, difficulty, timestamp }
  function getRecentSearches() { return lsGet(LS_RECENT); }
  function saveRecentSearch() {
    if (!state.ingredients.length) return; // only save if ingredients were entered
    var searches = getRecentSearches();
    var entry = {
      ingredients: state.ingredients.slice(),
      dietary:     state.dietary,
      time:        state.time,
      difficulty:  state.difficulty,
      timestamp:   Date.now(),
    };
    // Remove duplicate (same ingredient set)
    var ingKey = entry.ingredients.slice().sort().join(',');
    searches = searches.filter(function (s) {
      return s.ingredients.slice().sort().join(',') !== ingKey;
    });
    searches.unshift(entry);          // newest first
    if (searches.length > MAX_RECENT) searches = searches.slice(0, MAX_RECENT);
    lsSet(LS_RECENT, searches);
    renderRecentSearches();
  }
  function removeRecentSearch(idx) {
    var searches = getRecentSearches();
    searches.splice(idx, 1);
    lsSet(LS_RECENT, searches);
    renderRecentSearches();
  }

  // ── DOM References ──────────────────────────────
  const ingredientInput  = document.getElementById('ingredientInput');
  const addIngredientBtn = document.getElementById('addIngredientBtn');
  const tagsContainer    = document.getElementById('tagsContainer');
  const tagsPlaceholder  = document.getElementById('tagsPlaceholder');
  const findRecipeBtn    = document.getElementById('findRecipeBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  const navToggle        = document.getElementById('navToggle');
  const navLinks         = document.querySelector('.nav-links');
  const startCooking     = document.getElementById('startCooking');
  const recentSection    = document.getElementById('recent-searches-section');
  const recentList       = document.getElementById('recentSearchesList');
  const clearSearchesBtn = document.getElementById('clearSearchesBtn');
  const favoritesSection = document.getElementById('favorites-section');
  const favoritesGrid    = document.getElementById('favoritesGrid');
  const clearFavoritesBtn= document.getElementById('clearFavoritesBtn');

  // ── Nav Mobile Toggle ───────────────────────────
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // ── Smooth scroll for Start Cooking ────────────
  startCooking.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  });

  // ── Ingredients ─────────────────────────────────
  function normalise(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function addIngredient() {
    var raw = ingredientInput.value;
    var val = normalise(raw);
    if (!val) return;
    if (state.ingredients.map(normalise).includes(val)) {
      ingredientInput.value = '';
      shakeInput();
      return;
    }
    state.ingredients.push(val);
    ingredientInput.value = '';
    renderTags();
  }

  function removeIngredient(ingredient) {
    state.ingredients = state.ingredients.filter(function (i) { return i !== ingredient; });
    renderTags();
  }

  function renderTags() {
    Array.from(tagsContainer.children).forEach(function (child) {
      if (child !== tagsPlaceholder) child.remove();
    });
    if (state.ingredients.length === 0) {
      tagsPlaceholder.style.display = '';
      return;
    }
    tagsPlaceholder.style.display = 'none';
    state.ingredients.forEach(function (ingredient) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML =
        escapeHtml(ingredient) +
        '<button class="tag-remove" aria-label="Remove ' + escapeHtml(ingredient) + '">×</button>';
      tag.querySelector('.tag-remove').addEventListener('click', function () {
        removeIngredient(ingredient);
      });
      tagsContainer.appendChild(tag);
    });
  }

  function shakeInput() {
    ingredientInput.classList.add('shake');
    setTimeout(function () { ingredientInput.classList.remove('shake'); }, 400);
  }

  addIngredientBtn.addEventListener('click', addIngredient);
  ingredientInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addIngredient();
  });

  // ── Chip Groups ──────────────────────────────────
  function initChipGroup(groupId, stateKey) {
    var group = document.getElementById(groupId);
    group.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state[stateKey] = chip.dataset.value;
      });
    });
  }

  initChipGroup('dietaryGroup', 'dietary');
  initChipGroup('timeGroup', 'time');
  initChipGroup('difficultyGroup', 'difficulty');

  // ── Recipe Matching ──────────────────────────────
  function matchScore(recipe) {
    if (!state.ingredients.length) return 1;
    var matched = 0;
    state.ingredients.forEach(function (ing) {
      recipe.keywords.forEach(function (kw) {
        if (kw.includes(ing) || ing.includes(kw)) matched++;
      });
    });
    return matched;
  }

  function passesFilters(recipe) {
    if (state.dietary !== 'no-preference' && !recipe.dietary.includes(state.dietary)) return false;
    if (state.time !== 'any' && recipe.time > parseInt(state.time, 10)) return false;
    if (state.difficulty !== 'any' && recipe.difficulty !== state.difficulty) return false;
    return true;
  }

  // Recipe retrieval: show all when no ingredients entered; top matches when ingredients given
  function filterRecipes() {
    // Step 1: apply preference filters (dietary / time / difficulty)
    var filtered = RECIPES.filter(passesFilters);

    // Step 2: score every filtered recipe by ingredient overlap
    var scored = filtered.map(function (r) {
      return { recipe: r, score: matchScore(r) };
    }).sort(function (a, b) { return b.score - a.score; });

    // Step 3: no ingredients entered → show ALL preference-filtered recipes
    if (!state.ingredients.length) {
      return scored.map(function (s) { return s.recipe; });
    }

    // Step 4: ingredients entered → keep only recipes with at least 1 match
    var withMatch = scored.filter(function (s) { return s.score > 0; });

    // Step 5: fewer than 3 matched → fall back to full preference-filtered list
    // (closest matches first) so the user always sees something useful
    if (withMatch.length < 3) {
      withMatch = scored;
    }

    // Step 6: cap ingredient-based results at 10 so the page stays readable
    return withMatch.slice(0, 10).map(function (s) { return s.recipe; });
  }

  // ── Utility ──────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function labelForDiet(dietArray) {
    if (dietArray.includes('vegan')) return 'Vegan';
    if (dietArray.includes('vegetarian')) return 'Vegetarian';
    if (dietArray.includes('non-vegetarian')) return 'Non-Veg';
    return 'Any';
  }

  // ── Ingredient Analysis ───────────────────────────
  // Returns { have: [], need: [] } comparing user ingredients vs recipe keywords
  function analyseIngredients(recipe) {
    var have = [];
    var need = [];

    recipe.keywords.forEach(function (kw) {
      var matched = state.ingredients.some(function (ing) {
        return kw.includes(ing) || ing.includes(kw);
      });
      if (matched) {
        have.push(kw);
      } else {
        need.push(kw);
      }
    });

    // If no user ingredients entered, mark all as needed
    if (!state.ingredients.length) {
      need = recipe.keywords.slice();
      have = [];
    }

    return { have: have, need: need };
  }

  // ── Detail View ───────────────────────────────────
  function showDetailView(recipe) {
    var analysis = analyseIngredients(recipe);
    var diffLabel = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    var dietLabel = labelForDiet(recipe.dietary);

    var haveHtml = analysis.have.length
      ? analysis.have.map(function (k) {
          return '<span class="detail-badge detail-badge--have">✓ ' + escapeHtml(k) + '</span>';
        }).join('')
      : '<span class="detail-none">—</span>';

    var needHtml = analysis.need.length
      ? analysis.need.map(function (k) {
          return '<span class="detail-badge detail-badge--need">+ ' + escapeHtml(k) + '</span>';
        }).join('')
      : '<span class="detail-none">None — you have everything!</span>';

    var subsHtml = (recipe.substitutions || []).map(function (s) {
      return '<li>' + escapeHtml(s) + '</li>';
    }).join('');

    var stepsHtml = recipe.steps.map(function (s, i) {
      return '<li><span class="detail-step-num">' + (i + 1) + '</span>' + escapeHtml(s) + '</li>';
    }).join('');

    var panel = document.createElement('div');
    panel.className = 'detail-panel';
    panel.innerHTML =
      '<div class="detail-inner">' +
        '<button class="btn-back" id="backToRecipes">← Back to Recipes</button>' +
        '<div class="detail-header">' +
          '<span class="detail-emoji">' + recipe.emoji + '</span>' +
          '<div>' +
            '<h2 class="detail-title">' + escapeHtml(recipe.name) + '</h2>' +
            '<p class="detail-description">' + escapeHtml(recipe.description) + '</p>' +
            '<div class="detail-meta">' +
              '<span class="meta-tag">⏱️ ' + recipe.time + ' min</span>' +
              '<span class="meta-tag">🎯 ' + escapeHtml(diffLabel) + '</span>' +
              '<span class="meta-tag">🌿 ' + escapeHtml(dietLabel) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h3 class="detail-section-title">🧺 Ingredient Analysis</h3>' +
          '<div class="detail-analysis-grid">' +
            '<div class="detail-analysis-box">' +
              '<div class="detail-analysis-label detail-analysis-label--have">Ingredients You Have</div>' +
              '<div class="detail-badge-group">' + haveHtml + '</div>' +
            '</div>' +
            '<div class="detail-analysis-box">' +
              '<div class="detail-analysis-label detail-analysis-label--need">Additional Ingredients Needed</div>' +
              '<div class="detail-badge-group">' + needHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h3 class="detail-section-title">🔄 Smart Substitutions</h3>' +
          '<ul class="detail-list">' + subsHtml + '</ul>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h3 class="detail-section-title">👨‍🍳 Step-by-Step Instructions</h3>' +
          '<ol class="detail-steps">' + stepsHtml + '</ol>' +
        '</div>' +

        '<div class="detail-boxes">' +
          '<div class="detail-tip-box detail-tip-box--tip">' +
            '<strong>💡 Cooking Tip</strong>' +
            '<p>' + escapeHtml(recipe.tip) + '</p>' +
          '</div>' +
          '<div class="detail-tip-box detail-tip-box--diet">' +
            '<strong>🌿 Dietary Adjustment</strong>' +
            '<p>' + escapeHtml(recipe.dietaryAdjustment) + '</p>' +
          '</div>' +
          '<div class="detail-tip-box detail-tip-box--waste">' +
            '<strong>♻️ Food Waste Reduction</strong>' +
            '<p>' + escapeHtml(recipe.wasteReductionTip) + '</p>' +
          '</div>' +
        '</div>' +

        '<div class="detail-back-bottom">' +
          '<button class="btn btn-primary" id="backToRecipesBottom">← Back to Recipes</button>' +
        '</div>' +
      '</div>';

    // Replace the results area content with the detail panel
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(panel);
    resultsContainer.style.display = '';

    // Bind back buttons
    document.getElementById('backToRecipes').addEventListener('click', restoreResultsView);
    document.getElementById('backToRecipesBottom').addEventListener('click', restoreResultsView);

    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Restore Results View after Back ──────────────
  var _lastResults = [];

  function restoreResultsView() {
    renderRecipes(_lastResults);
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Render Recipe Cards ───────────────────────────
  function renderRecipes(recipes) {
    _lastResults = recipes;

    // Rebuild the standard results layout (title + subtitle + grid)
    resultsContainer.innerHTML =
      '<h2 class="section-title">Your Personalized Recipes</h2>' +
      '<p class="section-sub" id="resultsSubtitle"></p>' +
      '<div class="recipes-grid" id="recipesGrid"></div>';

    var subtitle = document.getElementById('resultsSubtitle');
    var grid = document.getElementById('recipesGrid');

    if (recipes.length === 0) {
      subtitle.textContent = 'No matches found — try relaxing your filters.';
      grid.innerHTML =
        '<div class="no-results"><span>🤔</span>No recipes match your current ingredients and preferences.<br>Try adding more ingredients or adjusting your filters.</div>';
      return;
    }

    subtitle.textContent = recipes.length + ' recipe' + (recipes.length > 1 ? 's' : '') +
      (state.ingredients.length > 0 ? ' matched your ingredients and preferences' : ' available — add ingredients to narrow results');

    recipes.forEach(function (recipe) {
      var analysis = analyseIngredients(recipe);
      var matchCount = analysis.have.length;
      var totalCount = recipe.keywords.length;

      var card = document.createElement('div');
      card.className = 'recipe-card';

      var diffLabel = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
      var dietLabel = labelForDiet(recipe.dietary);
      var favActive = isFav(recipe.id);

      var matchBar = state.ingredients.length > 0
        ? '<div class="match-bar-wrap">' +
            '<div class="match-bar-label">' + matchCount + ' of ' + totalCount + ' key ingredients matched</div>' +
            '<div class="match-bar-track"><div class="match-bar-fill" style="width:' + Math.round((matchCount / totalCount) * 100) + '%"></div></div>' +
          '</div>'
        : '';

      card.innerHTML =
        '<button class="btn-fav' + (favActive ? ' is-fav' : '') + '" data-id="' + recipe.id + '" aria-label="' + (favActive ? 'Remove from' : 'Add to') + ' favorites" title="' + (favActive ? 'Remove from favorites' : 'Save to favorites') + '">' +
          (favActive ? '❤️' : '🤍') +
        '</button>' +
        '<div class="recipe-card-header">' +
          '<span class="recipe-emoji">' + recipe.emoji + '</span>' +
          '<div>' +
            '<div class="recipe-title">' + escapeHtml(recipe.name) + '</div>' +
            '<div class="recipe-meta">' +
              '<span class="meta-tag">⏱️ ' + recipe.time + ' min</span>' +
              '<span class="meta-tag">🎯 ' + escapeHtml(diffLabel) + '</span>' +
              '<span class="meta-tag">🌿 ' + escapeHtml(dietLabel) + '</span>' +
            '</div>' +
            matchBar +
          '</div>' +
        '</div>' +
        '<div class="recipe-card-body">' +
          '<p class="recipe-description">' + escapeHtml(recipe.description) + '</p>' +
          '<div>' +
            '<div class="recipe-section-label">Ingredients</div>' +
            '<ul class="recipe-list">' +
              recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<div class="recipe-section-label">Steps</div>' +
            '<ol class="steps-list">' +
              recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
            '</ol>' +
          '</div>' +
          '<div class="tip-box"><strong>💡 Tip:</strong> ' + escapeHtml(recipe.tip) + '</div>' +
          '<button class="btn-view-detail" data-id="' + recipe.id + '">View Full Recipe →</button>' +
        '</div>';

      grid.appendChild(card);
    });

    // Bind fav buttons
    grid.querySelectorAll('.btn-fav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.dataset.id, 10);
        toggleFav(id);
        var nowFav = isFav(id);
        btn.classList.toggle('is-fav', nowFav);
        btn.textContent = nowFav ? '❤️' : '🤍';
        btn.title = nowFav ? 'Remove from favorites' : 'Save to favorites';
        btn.setAttribute('aria-label', (nowFav ? 'Remove from' : 'Add to') + ' favorites');
        renderFavorites();
      });
    });

    // Bind detail view buttons
    grid.querySelectorAll('.btn-view-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.dataset.id, 10);
        var recipe = RECIPES.find(function (r) { return r.id === id; });
        if (recipe) showDetailView(recipe);
      });
    });
  }

  // ── Render Favorites ─────────────────────────────
  function renderFavorites() {
    var ids = getFavIds();
    if (ids.length === 0) {
      favoritesSection.style.display = 'none';
      return;
    }
    favoritesSection.style.display = '';
    favoritesGrid.innerHTML = '';

    ids.forEach(function (id) {
      var recipe = RECIPES.find(function (r) { return r.id === id; });
      if (!recipe) return;

      var diffLabel = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
      var dietLabel = labelForDiet(recipe.dietary);

      var card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML =
        '<button class="btn-fav is-fav" data-id="' + recipe.id + '" aria-label="Remove from favorites" title="Remove from favorites">❤️</button>' +
        '<div class="recipe-card-header">' +
          '<span class="recipe-emoji">' + recipe.emoji + '</span>' +
          '<div>' +
            '<div class="recipe-title">' + escapeHtml(recipe.name) + '</div>' +
            '<div class="recipe-meta">' +
              '<span class="meta-tag">⏱️ ' + recipe.time + ' min</span>' +
              '<span class="meta-tag">🎯 ' + escapeHtml(diffLabel) + '</span>' +
              '<span class="meta-tag">🌿 ' + escapeHtml(dietLabel) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="recipe-card-body">' +
          '<p class="recipe-description">' + escapeHtml(recipe.description) + '</p>' +
          '<div>' +
            '<div class="recipe-section-label">Ingredients</div>' +
            '<ul class="recipe-list">' +
              recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
          '<div class="tip-box"><strong>💡 Tip:</strong> ' + escapeHtml(recipe.tip) + '</div>' +
          '<button class="btn-view-detail" data-id="' + recipe.id + '">View Full Recipe →</button>' +
        '</div>';

      // Fav toggle from favorites grid
      card.querySelector('.btn-fav').addEventListener('click', function () {
        toggleFav(recipe.id);
        renderFavorites();
        // Also refresh fav button state in the main results grid if visible
        var mainBtn = document.querySelector('#recipesGrid .btn-fav[data-id="' + recipe.id + '"]');
        if (mainBtn) {
          mainBtn.classList.remove('is-fav');
          mainBtn.textContent = '🤍';
          mainBtn.title = 'Save to favorites';
        }
      });

      // Detail view from favorites grid
      card.querySelector('.btn-view-detail').addEventListener('click', function () {
        showDetailView(recipe);
      });

      favoritesGrid.appendChild(card);
    });
  }

  // ── Render Recent Searches ───────────────────────
  function renderRecentSearches() {
    var searches = getRecentSearches();
    if (searches.length === 0) {
      recentSection.style.display = 'none';
      return;
    }
    recentSection.style.display = '';
    recentList.innerHTML = '';

    searches.forEach(function (entry, idx) {
      var date = new Date(entry.timestamp);
      var timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                    ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      var pill = document.createElement('div');
      pill.className = 'search-pill';

      var tagsHtml = entry.ingredients.map(function (ing) {
        return '<span class="search-pill-tag">' + escapeHtml(ing) + '</span>';
      }).join('');

      pill.innerHTML =
        '<div class="search-pill-tags">' + tagsHtml + '</div>' +
        '<span class="search-pill-meta">' + escapeHtml(timeStr) + '</span>' +
        '<button class="search-pill-remove" aria-label="Remove this search">×</button>';

      // Click pill body to re-run that search
      pill.addEventListener('click', function (e) {
        if (e.target.classList.contains('search-pill-remove')) return;
        loadSearch(entry);
      });

      // Remove individual entry
      pill.querySelector('.search-pill-remove').addEventListener('click', function (e) {
        e.stopPropagation();
        removeRecentSearch(idx);
      });

      recentList.appendChild(pill);
    });
  }

  // Load a saved search back into the form and re-run it
  function loadSearch(entry) {
    // Restore ingredients
    state.ingredients = entry.ingredients.slice();
    renderTags();

    // Restore dietary chip
    state.dietary = entry.dietary;
    var dietGroup = document.getElementById('dietaryGroup');
    dietGroup.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('active', c.dataset.value === entry.dietary);
    });

    // Restore time chip
    state.time = entry.time;
    var timeGroup = document.getElementById('timeGroup');
    timeGroup.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('active', c.dataset.value === entry.time);
    });

    // Restore difficulty chip
    state.difficulty = entry.difficulty;
    var diffGroup = document.getElementById('difficultyGroup');
    diffGroup.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('active', c.dataset.value === entry.difficulty);
    });

    // Scroll to form and trigger search
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () {
      var matches = filterRecipes();
      renderRecipes(matches);
      resultsContainer.style.display = '';
      setTimeout(function () {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }, 400);
  }

  // ── Clear All buttons ────────────────────────────
  clearSearchesBtn.addEventListener('click', function () {
    lsSet(LS_RECENT, []);
    renderRecentSearches();
  });

  clearFavoritesBtn.addEventListener('click', function () {
    lsSet(LS_FAVS, []);
    // Reset all fav buttons currently visible in the results grid
    document.querySelectorAll('#recipesGrid .btn-fav').forEach(function (btn) {
      btn.classList.remove('is-fav');
      btn.textContent = '🤍';
      btn.title = 'Save to favorites';
    });
    renderFavorites();
  });

  // ── Find Recipe Button ───────────────────────────
  findRecipeBtn.addEventListener('click', function () {
    saveRecentSearch();               // save before rendering
    var matches = filterRecipes();
    renderRecipes(matches);
    resultsContainer.style.display = '';
    setTimeout(function () {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });

  // ── Page load: restore persisted data ───────────
  renderRecentSearches();
  renderFavorites();

})();
