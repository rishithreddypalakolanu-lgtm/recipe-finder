const STORAGE_KEY = "recipe-finder-favourites";

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function write(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getFavourites() {
  return read();
}

export function isFavourite(id) {
  return read().some(recipe => String(recipe.idMeal) === String(id));
}

export function toggleFavourite(recipe) {
  const items = read();
  const index = items.findIndex(item => String(item.idMeal) === String(recipe.idMeal));

  if (index >= 0) {
    items.splice(index, 1);
  } else {
    items.push({ ...recipe });
  }

  write(items);
  return items;
}
