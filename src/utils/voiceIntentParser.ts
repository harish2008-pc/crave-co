import { Dish } from '../types';

export type VoiceActionType = 
  | { type: 'ADD_TO_CART'; dish: Dish; quantity: number; rawText: string }
  | { type: 'SEARCH'; query: string; rawText: string }
  | { type: 'OPEN_CART'; rawText: string }
  | { type: 'CLEAR_SEARCH'; rawText: string }
  | { type: 'NAVIGATE'; screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout'; rawText: string }
  | { type: 'UNKNOWN'; rawText: string };

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates similarity between two strings based on token matches and substrings
 */
function calculateDishScore(spokenPhrase: string, dish: Dish): number {
  const normalizedSpoken = normalizeText(spokenPhrase);
  const normalizedDishName = normalizeText(dish.name);
  const normalizedCategory = normalizeText(dish.category);
  const normalizedDesc = normalizeText(dish.description || '');

  // Exact dish name containment
  if (normalizedSpoken.includes(normalizedDishName)) {
    return 100;
  }
  if (normalizedDishName.includes(normalizedSpoken) && normalizedSpoken.length > 4) {
    return 80;
  }

  // Token matching
  const spokenTokens = normalizedSpoken.split(' ').filter(t => t.length > 2);
  const dishTokens = normalizedDishName.split(' ').filter(t => t.length > 2);
  
  let matchCount = 0;
  for (const token of spokenTokens) {
    if (dishTokens.some(dt => dt.includes(token) || token.includes(dt))) {
      matchCount += 2;
    } else if (normalizedDesc.includes(token)) {
      matchCount += 0.5;
    } else if (normalizedCategory.includes(token)) {
      matchCount += 0.8;
    }
  }

  // Key word bonuses for famous menu keywords
  const specialKeywords: Record<string, string[]> = {
    'truffle': ['truffle-mushroom-pizza'],
    'mushroom': ['truffle-mushroom-pizza'],
    'mortadella': ['pistachio-mortadella-pizza'],
    'pistachio': ['pistachio-mortadella-pizza', 'sicilian-cannoli'],
    'wings': ['hot-honey-wings'],
    'honey': ['hot-honey-wings'],
    'burrata': ['burrata-caprese-rustica'],
    'caprese': ['burrata-caprese-rustica'],
    'cannoli': ['sicilian-cannoli'],
    'calzone': ['nutella-hazelnut-calzone'],
    'nutella': ['nutella-hazelnut-calzone'],
    'chocolate': ['nutella-hazelnut-calzone'],
  };

  for (const [kw, dishIds] of Object.entries(specialKeywords)) {
    if (normalizedSpoken.includes(kw) && dishIds.includes(dish.id)) {
      matchCount += 3;
    }
  }

  return matchCount;
}

/**
 * Finds the closest dish matching the spoken phrase
 */
export function findBestMatchingDish(spokenText: string, dishes: Dish[]): { dish: Dish; score: number } | null {
  if (!dishes || dishes.length === 0) return null;

  let bestDish: Dish | null = null;
  let highestScore = 0;

  for (const dish of dishes) {
    const score = calculateDishScore(spokenText, dish);
    if (score > highestScore) {
      highestScore = score;
      bestDish = dish;
    }
  }

  // Minimum threshold to prevent false positives
  if (bestDish && highestScore >= 1.5) {
    return { dish: bestDish, score: highestScore };
  }

  return null;
}

/**
 * Parses user spoken voice transcript into an actionable intent
 */
export function parseVoiceIntent(transcript: string, dishes: Dish[]): VoiceActionType {
  const clean = normalizeText(transcript);
  if (!clean) {
    return { type: 'UNKNOWN', rawText: transcript };
  }

  // 1. Check for Cart Drawer / Checkout intents
  if (
    clean.includes('open cart') || 
    clean.includes('open bag') || 
    clean.includes('show cart') || 
    clean.includes('show bag') || 
    clean.includes('view cart') || 
    clean.includes('view bag') ||
    clean === 'cart' ||
    clean === 'bag'
  ) {
    return { type: 'OPEN_CART', rawText: transcript };
  }

  // 2. Check for Navigation intents
  if (clean.includes('tracking') || clean.includes('track order') || clean.includes('chauffeur') || clean.includes('where is my food')) {
    return { type: 'NAVIGATE', screen: 'tracking', rawText: transcript };
  }
  if (clean.includes('dashboard') || clean.includes('hearth') || clean.includes('kitchen') || clean.includes('telemetry')) {
    return { type: 'NAVIGATE', screen: 'dashboard', rawText: transcript };
  }
  if (clean.includes('prive') || clean.includes('privé') || clean.includes('vip') || clean.includes('rewards') || clean.includes('club') || clean.includes('my points')) {
    return { type: 'NAVIGATE', screen: 'club', rawText: transcript };
  }
  if (clean.includes('checkout') || clean.includes('place order') || clean.includes('pay now')) {
    return { type: 'NAVIGATE', screen: 'checkout', rawText: transcript };
  }

  // 3. Check for Clear Search
  if (clean.includes('clear search') || clean.includes('reset search') || clean === 'clear' || clean.includes('show all dishes') || clean.includes('show all menu')) {
    return { type: 'CLEAR_SEARCH', rawText: transcript };
  }

  // 4. Check for "Add to Cart" or "Order" intents
  const isAddCommand = 
    clean.startsWith('add ') ||
    clean.includes('add to cart') ||
    clean.includes('add to bag') ||
    clean.includes('add in cart') ||
    clean.includes('add in bag') ||
    clean.startsWith('order ') ||
    clean.startsWith('buy ') ||
    clean.startsWith('i want ') ||
    clean.startsWith('put ') ||
    clean.includes('to my bag') ||
    clean.includes('to my cart');

  // Check if quantity is specified (e.g. "add 2 truffle pizzas")
  let quantity = 1;
  const qtyMatch = clean.match(/\b(1|2|3|4|5|one|two|three|four|five)\b/);
  if (qtyMatch) {
    const word = qtyMatch[1];
    if (word === 'one' || word === '1') quantity = 1;
    else if (word === 'two' || word === '2') quantity = 2;
    else if (word === 'three' || word === '3') quantity = 3;
    else if (word === 'four' || word === '4') quantity = 4;
    else if (word === 'five' || word === '5') quantity = 5;
  }

  // Extract dish part if command starts with 'add', 'order', etc.
  let dishQuery = clean
    .replace(/^add (to cart|to bag|in cart|in bag)?/, '')
    .replace(/\b(to cart|to bag|in my cart|in my bag|in cart|in bag)\b/g, '')
    .replace(/^order /, '')
    .replace(/^buy /, '')
    .replace(/^i want (a|an|the)? /, '')
    .replace(/^put /, '')
    .replace(/\b(please|can you)\b/g, '')
    .trim();

  // If it was explicitly an add command, or if a dish strongly matches
  if (isAddCommand) {
    const matched = findBestMatchingDish(dishQuery || clean, dishes);
    if (matched) {
      return {
        type: 'ADD_TO_CART',
        dish: matched.dish,
        quantity,
        rawText: transcript
      };
    }
  }

  // Even if they didn't say "add", if they say a specific dish name like "truffle pizza" or "burrata caprese",
  // check if there's a strong direct match. If they said "search truffle pizza", then search; but if they said "search ...", parse as search.
  const isExplicitSearch = 
    clean.startsWith('search ') ||
    clean.startsWith('search for ') ||
    clean.startsWith('find ') ||
    clean.startsWith('look for ') ||
    clean.startsWith('show me ');

  if (isExplicitSearch) {
    const searchTerm = clean
      .replace(/^search for /, '')
      .replace(/^search /, '')
      .replace(/^find /, '')
      .replace(/^look for /, '')
      .replace(/^show me /, '')
      .replace(/\b(please|dishes|food|items)\b/g, '')
      .trim();

    return {
      type: 'SEARCH',
      query: searchTerm || clean,
      rawText: transcript
    };
  }

  // If not explicit search, but they might be searching or asking for a dish:
  // If exact or strong dish match:
  const potentialDishMatch = findBestMatchingDish(clean, dishes);
  if (potentialDishMatch && potentialDishMatch.score >= 3.0) {
    // If it's a very strong match, we can offer to add it or search it.
    // By default, if they said "Add ...", it's already caught above.
    // If they just said "Truffle Pizza", let's search it so they see it, but also highlight it.
    return {
      type: 'SEARCH',
      query: potentialDishMatch.dish.name,
      rawText: transcript
    };
  }

  // General search query fallback
  return {
    type: 'SEARCH',
    query: clean,
    rawText: transcript
  };
}
