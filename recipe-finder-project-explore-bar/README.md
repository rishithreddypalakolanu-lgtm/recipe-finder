# Recipe Finder — Search & Favourites

A responsive HTML + CSS + JavaScript project based on the Recipe Finder case study.

## Features

- TheMealDB API integration
- Search by recipe name
- 300ms debounced search
- Recipe grid with images
- Recipe details modal
- Ingredients and instructions
- YouTube recipe link
- Favourites using localStorage
- Separate Favourites view
- Loading, empty and error states
- ES modules
- Responsive design
- ESC and outside-click modal closing

## Run locally

Because this project uses ES modules, open it through a local server rather than directly with `file://`.

### VS Code

Install the **Live Server** extension, then right-click `index.html` → **Open with Live Server**.

### Python

From the project folder:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

TheMealDB is used through its public v1 API endpoints.

## Expanded food browsing
- **All Foods** loads meals from all available TheMealDB categories and removes duplicates.
- **Sweets** opens the Dessert category.
- **Browse** dynamically displays every category supplied by the API.

## New special collections

### Sweets

The special recipes work offline as built-in recipes, while TheMealDB remains the source for the broader recipe catalogue.
