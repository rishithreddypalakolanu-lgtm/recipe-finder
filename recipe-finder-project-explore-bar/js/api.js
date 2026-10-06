const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function searchMeals(query) {
  const clean = query.trim();
  if (!clean) return [];
  const data = await request(`${BASE_URL}/search.php?s=${encodeURIComponent(clean)}`);
  return data.meals ?? [];
}

export async function getMealById(id) {
  if (String(id).startsWith("special-")) {
    return SPECIAL_RECIPES.find(meal => meal.idMeal === id) ?? null;
  }
  const data = await request(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals?.[0] ?? null;
}

export async function getCategories() {
  const data = await request(`${BASE_URL}/categories.php`);
  return data.categories ?? [];
}

export async function getMealsByCategory(category) {
  const data = await request(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals ?? [];
}

export async function getAllMeals() {
  const categories = await getCategories();
  const batches = await Promise.all(categories.map(c => getMealsByCategory(c.strCategory)));
  const unique = new Map();
  batches.flat().forEach(meal => unique.set(meal.idMeal, meal));
  return [...unique.values()];
}

export async function getDesserts() {
  return getMealsByCategory("Dessert");
}

