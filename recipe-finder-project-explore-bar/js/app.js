import { searchMeals, getMealById, getAllMeals, getDesserts, getCategories, getMealsByCategory } from "./api.js";
import { getFavourites, toggleFavourite } from "./store.js";
import {
  renderRecipes, renderStatus, hideStatus, updateFavouriteCount,
  openModal, closeModal
} from "./ui.js";

const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const homeBtn = document.querySelector("#homeBtn");
const favouritesBtn = document.querySelector("#favouritesBtn");
const allFoodsBtn = document.querySelector("#allFoodsBtn");
const sweetsBtn = document.querySelector("#sweetsBtn");
const sectionTitle = document.querySelector("#sectionTitle");
const sectionEyebrow = document.querySelector("#sectionEyebrow");
const resultInfo = document.querySelector("#resultInfo");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalClose = document.querySelector("#modalClose");

let currentRecipes = [];
let searchTimer;
let requestNumber = 0;

function updateCount() {
  updateFavouriteCount(getFavourites().length);
}

function setView(view) {
  homeBtn.classList.toggle("active", view === "home");
  allFoodsBtn.classList.toggle("active", view === "all");
  sweetsBtn.classList.toggle("active", view === "sweets");
  favouritesBtn.classList.toggle("active", view === "favourites");
}
function renderCategoryButtons(categories){const bar=document.querySelector("#categoryBar");bar.innerHTML=`<span class="category-label">Explore:</span>`;categories.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="category-chip";b.textContent=c;b.addEventListener("click",()=>showCategory(c));bar.appendChild(b);});}
async function loadCategories(){try{const cs=await getCategories();renderCategoryButtons(cs.map(c=>c.strCategory));}catch{document.querySelector("#categoryBar").innerHTML="";}}
async function showAllFoods(){setView("all");document.querySelector("#recipeGrid").innerHTML="";renderStatus("loading");try{const m=await getAllMeals();showRecipes(m,"All foods","ALL FOOD ITEMS");resultInfo.textContent=`${m.length} food items`;}catch{renderStatus("error","Unable to load all food items.","Please try again.");}}
async function showSweets(){setView("sweets");document.querySelector("#recipeGrid").innerHTML="";renderStatus("loading");try{const m=await getDesserts();showRecipes(m,"Sweets & desserts","SWEETS & DESSERTS");resultInfo.textContent=`${m.length} sweets & desserts`;}catch{renderStatus("error","Unable to load sweets and desserts.","Please try again.");}}
async function showCategory(category){setView("all");document.querySelector("#recipeGrid").innerHTML="";renderStatus("loading");try{const m=await getMealsByCategory(category);showRecipes(m,category,`${category.toUpperCase()} RECIPES`);}catch{renderStatus("error",`Unable to load ${category} recipes.`,"Please try again.");}}



function showRecipes(recipes, title, eyebrow = "EXPLORE RECIPES") {
  currentRecipes = recipes;
  sectionTitle.textContent = title;
  sectionEyebrow.textContent = eyebrow;
  resultInfo.textContent = recipes.length ? `${recipes.length} recipe${recipes.length === 1 ? "" : "s"}` : "";
  hideStatus();

  if (!recipes.length) {
    document.querySelector("#recipeGrid").innerHTML = "";
    renderStatus("empty", "Try searching for a different recipe or ingredient.");
    return;
  }

  renderRecipes(recipes, loadRecipeDetails, handleFavourite);
}

async function loadRecipeDetails(id) {
  try {
    const meal = await getMealById(id);
    if (!meal) throw new Error("Recipe details were not found.");
    openModal(meal);
  } catch (error) {
    alert("Unable to load recipe details. Please check your connection and try again.");
  }
}

function handleFavourite(recipe) {
  toggleFavourite(recipe);
  updateCount();

  if (document.querySelector("#favouritesBtn").classList.contains("active")) {
    showFavourites();
  } else {
    renderRecipes(currentRecipes, loadRecipeDetails, handleFavourite);
  }
}

async function performSearch(query) {
  const value = query.trim();
  if (!value) {
    showHome();
    return;
  }

  const thisRequest = ++requestNumber;
  renderStatus("loading");
  document.querySelector("#recipeGrid").innerHTML = "";
  sectionTitle.textContent = `Results for “${value}”`;
  sectionEyebrow.textContent = "SEARCH RESULTS";
  resultInfo.textContent = "";

  try {
    const recipes = await searchMeals(value);
    if (thisRequest !== requestNumber) return;
    showRecipes(recipes, `Results for “${value}”`, "SEARCH RESULTS");
    setView("home");
  } catch (error) {
    if (thisRequest !== requestNumber) return;
    renderStatus("error", "We couldn't reach the recipe service.", "Check your internet connection and try again.");
  }
}

// 300ms debounce: fast typing triggers only one API request after typing pauses.
function debouncedSearch(value) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => performSearch(value), 300);
}

async function showHome() {
  searchInput.value = "";
  setView("home");
  renderStatus("loading");
  document.querySelector("#recipeGrid").innerHTML = "";

  try {
    const recipes = await searchMeals("chicken");
    showRecipes(recipes, "Popular recipes", "EXPLORE RECIPES");
  } catch {
    renderStatus("error", "Unable to load recipes right now.", "Please refresh or search again.");
  }
}

function showFavourites() {
  const favourites = getFavourites();
  setView("favourites");
  showRecipes(favourites, "Your favourites", "SAVED RECIPES");
}

searchInput.addEventListener("input", event => {
  if (event.target.value.trim()) debouncedSearch(event.target.value);
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  clearTimeout(searchTimer);
  performSearch(searchInput.value);
});

document.querySelectorAll("[data-query]").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.query;
    performSearch(button.dataset.query);
  });
});

homeBtn.addEventListener("click", showHome);
allFoodsBtn.addEventListener("click", showAllFoods);
sweetsBtn.addEventListener("click", showSweets);
favouritesBtn.addEventListener("click", showFavourites);
modalClose.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

updateCount();
loadCategories();
showHome();
