# 🌍 Jordiffs Distribuida

A distributed full-stack project that integrates a **Strapi backend** with a **Vanilla JavaScript frontend**.  
This project demonstrates how to connect a modern CMS API (Strapi) with a frontend consuming multiple external APIs like Pokémon and Trivia.

---

## 📁 Project Structure

jordiffs-distribuida/
├── Readme.md
├── docker-compose.dev.yml
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── strapi-backend/ # Strapi CMS Backend
│ ├── README.md
│ ├── package.json
│ ├── tsconfig.json
│ ├── .env.example
│ ├── config/
│ │ ├── admin.ts
│ │ ├── api.ts
│ │ ├── database.ts
│ │ ├── middlewares.ts
│ │ ├── plugins.ts
│ │ └── server.ts
│ ├── src/
│ │ ├── api/
│ │ │ └── hello/
│ │ │ ├── controllers/
│ │ │ │ └── hello.js
│ │ │ ├── routes/
│ │ │ │ └── hello.js
│ │ │ └── services/
│ │ │ └── hello.js
│ │ └── index.ts
│ └── types/
│ └── generated/
│ ├── components.d.ts
│ └── contentTypes.d.ts
└── vanilla-app/ # Frontend Application (Vanilla JS)
├── index.html
├── main.js
├── package.json
├── .env.template
├── backend/
│ ├── server.js
│ └── db/
│ └── favoritesModel.js
├── src/
│ ├── api/
│ │ └── api.js
│ ├── config/
│ │ └── env.js
│ ├── hooks/
│ │ ├── useFavorites.js
│ │ ├── usePokemons.js
│ │ └── useTrivia.js
│ ├── views/
│ │ ├── ClaimView.js
│ │ ├── FavoritesView.js
│ │ ├── HelloView.js
│ │ ├── HomeView.js
│ │ ├── LoginView.js
│ │ └── SurveyView.js
└── styles/
├── claim.css
├── global.css
├── hello.css
├── home.css
├── login.css
└── survey.css


---

## 🚀 Features

### 🧠 Backend (Strapi)
- Built with **Strapi v5.29.0**.
- Includes a custom endpoint `/api/hello` and `/api/hello/secure`.
- Uses SQLite for local development.
- Ready for Docker and cloud deployment.

### 💡 Frontend (Vanilla JavaScript)
- Consumes:
  - **Pokémon API** → [`https://pokeapi.co/api/v2/pokemon`](https://pokeapi.co/)
  - **Trivia API** → [`https://opentdb.com/api.php`](https://opentdb.com/)
- Communicates with Strapi backend for secure routes.
- Includes multiple functional views and custom hooks for logic separation.

---

## ⚙️ Environment Configuration

### 🔹 For the **Frontend**

Rename the file `.env.template` to `.env` and set the following:

```env
# 🌐 Main Pokémon API
POKEMON_API_URL=https://pokeapi.co/api/v2/pokemon

# ❓ Trivia API
TRIVIA_API_URL=https://opentdb.com/api.php?amount=50&category=21

# ⚙️ Backend (local or deployed)
BACKEND_URL=https://strapi-backend-az7o.onrender.com

# 📱 Application name
APP_NAME=VanillaApp

# Environment Configuration File (env.js)

export const ENV = {
  // 🌐 APIs
  POKEMON_API_URL: 'https://pokeapi.co/api/v2/pokemon',
  TRIVIA_API_URL: 'https://opentdb.com/api.php?amount=50&category=21',

  // ⚙️ Backend
  BACKEND_URL: 'https://strapi-backend-az7o.onrender.com',
  STRAPI_URL: 'https://strapi-backend-az7o.onrender.com',

  // 📱 App
  APP_NAME: 'VanillaApp',

  // 🔧 Development mode
  isDevelopment: window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1'
};

export function getBackendUrl() {
  return ENV.isDevelopment
    ? 'http://localhost:1337'
    : ENV.BACKEND_URL;
}

console.log('⚙️ Configuration loaded:', ENV);

#🧩 Installation & Execution

##1️⃣ Clone the Repository

git clone https://github.com/yourusername/jordiffs-distribuida.git
cd jordiffs-distribuida

##2️⃣ Run the Backend (Strapi)
cd strapi-backend
npm install
npm run develop

The Strapi server will be available at:
🔗 http://localhost:1337

##3️⃣ Run the Frontend (Vanilla App)
cd ../vanilla-app
npm install
npm run start

The app will start locally (usually at http://localhost:3000)

🔐 API Endpoints

| Method | Endpoint            | Auth Required | Description                      |
| ------ | ------------------- | ------------- | -------------------------------- |
| GET    | `/api/hello`        | ❌ No          | Public test endpoint             |
| GET    | `/api/hello/secure` | ✅ Yes         | Secure endpoint (requires token) |


🐳 Docker Support
docker-compose up --build


🧠 Technologies Used

| Category   | Technology                                        |
| ---------- | ------------------------------------------------- |
| Backend    | Strapi v5, Node.js                                |
| Frontend   | Vanilla JavaScript, HTML, CSS                     |
| APIs       | Pokémon API, Open Trivia DB                       |
| Database   | SQLite (local), configurable for PostgreSQL/MySQL |
| Deployment | Docker & Render                                   |


👨‍💻 Author

Jordi Fiallos
Project: jordiffs-distribuida
Version: 1.0.0
📧 Contact: [your-email@example.com
]
🚀 GitHub: https://github.com/yourusername

📜 License

This project is licensed under the MIT License.


Would you like me to make a **Spanish version** too (for the inner `strapi-backend/README.md`)? It could explain only the backend part with setup and endpoints.
