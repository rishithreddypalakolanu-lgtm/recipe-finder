# Recipe Finder Backend — Spring Boot + MySQL

## What this backend provides

- User registration
- User login/logout using secure server-side sessions
- Password hashing with BCrypt
- Create recipe
- View all recipes
- Search by recipe name or ingredient
- Filter by category
- View one recipe
- Edit own recipe
- Delete own recipe
- Like recipe
- Save/unsave favourite recipe
- My Recipes endpoint
- CORS support for frontend deployment

## Requirements

- Java 17+
- Maven 3.9+
- MySQL 8+

## 1. Create database

MySQL can create it automatically because the JDBC URL contains `createDatabaseIfNotExist=true`.

Default configuration:

```text
database: recipe_finder
username: root
password: root
port: 3306
```

If your MySQL password is different, edit:

`src/main/resources/application.properties`

## 2. Start backend

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

If Maven is installed:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

## API endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Example registration/login JSON:

```json
{
  "username": "student",
  "password": "student123"
}
```

### Recipes

```text
GET    /api/recipes
GET    /api/recipes?q=chicken
GET    /api/recipes?category=veg
GET    /api/recipes/{id}
POST   /api/recipes
PUT    /api/recipes/{id}
DELETE /api/recipes/{id}
POST   /api/recipes/{id}/like
POST   /api/recipes/{id}/favorite
GET    /api/recipes/mine/list
```

### Create recipe example

```json
{
  "title": "Easy Paneer Rice",
  "category": "veg",
  "cookingTime": 25,
  "ingredients": "2 cups rice\n200g paneer\n1 onion\n1 tomato\nSalt",
  "steps": "Cook rice.\nFry onion and tomato.\nAdd paneer.\nMix with rice and serve.",
  "photoUrl": ""
}
```

## Connect your existing Recipe Finder frontend

Change the frontend API base URL from localStorage-only logic to:

```text
http://localhost:8080/api
```

For fetch requests, use credentials so the login session is sent:

```javascript
fetch("http://localhost:8080/api/recipes", {
  credentials: "include"
});
```

Login:

```javascript
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    username: "demo",
    password: "demo123"
  })
});
```

For production, deploy the Spring Boot backend on Render/Railway/AWS and update the frontend API URL.
