import { isFavourite } from "./store.js";

export function renderRecipes(recipes, onOpen, onToggleFavourite) {
  const grid = document.querySelector("#recipeGrid");
  grid.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const saved = isFavourite(recipe.idMeal);

    card.innerHTML = `
      <div class="card-image-wrap">
        <img class="card-image" src="${escapeAttr(recipe.strMealThumb)}" alt="${escapeAttr(recipe.strMeal)}" loading="lazy">
        <button class="favourite-btn ${saved ? "saved" : ""}" type="button"
          aria-label="${saved ? "Remove from" : "Add to"} favourites"
          aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <div class="category">${escapeHtml(recipe.strCategory || recipe.strArea || "Recipe")}</div>
        <h3 class="card-title">${escapeHtml(recipe.strMeal)}</h3>
        <button class="view-btn" type="button">View recipe →</button>
      </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => onOpen(recipe.idMeal));
    card.querySelector(".favourite-btn").addEventListener("click", () => onToggleFavourite(recipe));
    grid.appendChild(card);
  });
}

export function renderStatus(type, message, detail = "") {
  const status = document.querySelector("#status");
  status.hidden = false;

  if (type === "loading") {
    status.innerHTML = `<div class="spinner"></div><strong>Finding delicious recipes...</strong><span>Please wait a moment.</span>`;
  } else if (type === "empty") {
    status.innerHTML = `<strong>No recipes found</strong><span>${escapeHtml(message || "Try another name or ingredient.")}</span>`;
  } else {
    status.innerHTML = `<strong>Something went wrong</strong><span>${escapeHtml(message || "Please try again.")}</span>${detail ? `<br><small>${escapeHtml(detail)}</small>` : ""}`;
  }
}

export function hideStatus() {
  document.querySelector("#status").hidden = true;
}

export function updateFavouriteCount(count) {
  document.querySelector("#favouriteCount").textContent = count;
}

export function openModal(meal) {
  const backdrop = document.querySelector("#modalBackdrop");
  const content = document.querySelector("#modalContent");

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (ingredient) ingredients.push(`<li><strong>${escapeHtml(measure || "")}</strong> ${escapeHtml(ingredient)}</li>`);
  }

  content.innerHTML = `
    <div class="modal-hero">
      <img src="${escapeAttr(meal.strMealThumb)}" alt="${escapeAttr(meal.strMeal)}">
      <div class="modal-summary">
        <div class="category">${escapeHtml(meal.strCategory || "Recipe")} · ${escapeHtml(meal.strArea || "International")}</div>
        <h2 id="modalTitle">${escapeHtml(meal.strMeal)}</h2>
        <div class="modal-meta">${meal.strTags ? escapeHtml(meal.strTags.split(",").join(" · ")) : "A delicious recipe to try at home."}</div>
      </div>
    </div>
    <div class="modal-body">
      <h3>Ingredients</h3>
      <ul class="ingredients">${ingredients.join("")}</ul>
      <h3>Instructions</h3>
      <p class="instructions">${escapeHtml(meal.strInstructions || "No instructions available.")}</p>
      ${meal.strYoutube ? `<a class="youtube-link" href="${escapeAttr(meal.strYoutube)}" target="_blank" rel="noopener noreferrer">▶ Watch on YouTube</a>` : ""}
    </div>
  `;

  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#modalClose").focus();
}

export function closeModal() {
  document.querySelector("#modalBackdrop").hidden = true;
  document.body.style.overflow = "";
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function escapeAttr(value = "") {
  return escapeHtml(value);
}
