/* ==============================
   🌍 CONFIGURACIÓN DINÁMICA (.env compatible)
============================== */

// Simular dotenv para frontend (Render o local)
async function loadEnv() {
  if (window.__ENV__) return window.__ENV__;

  try {
    // Intentar cargar archivo .env local en desarrollo
    const res = await fetch("/.env");
    const text = await res.text();

    const envVars = {};
    text.split("\n").forEach(line => {
      const [key, value] = line.split("=");
      if (key && value) envVars[key.trim()] = value.trim();
    });

    window.__ENV__ = envVars;
    return envVars;
  } catch {
    // Fallback a entorno de producción
    window.__ENV__ = {
      POKEMON_API_URL: "https://pokeapi.co/api/v2/pokemon",
      TRIVIA_API_URL: "https://opentdb.com/api.php?amount=50&category=21",
      BACKEND_URL: "https://strapi-backend-az7o.onrender.com",
      APP_NAME: "VanillaApp",
    };
    return window.__ENV__;
  }
}

/* ==============================
   🔧 CONFIG GLOBAL
============================== */
let CONFIG = null;

async function loadConfig() {
  if (!CONFIG) {
    const env = await loadEnv();
    CONFIG = {
      POKEMON_API_URL: env.POKEMON_API_URL,
      TRIVIA_API_URL: env.TRIVIA_API_URL,
      BACKEND_URL: env.BACKEND_URL,
      APP_NAME: env.APP_NAME,
    };
    console.log("✅ Configuración cargada:", CONFIG);
  }
  return CONFIG;
}

/* ==============================
   🧩 POKÉMON API
============================== */
export async function getPokemons(limit = 20, offset = 0) {
  const config = await loadConfig();
  const res = await fetch(`${config.POKEMON_API_URL}?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data.results;
}

export async function getPokemonDetails(url) {
  const res = await fetch(url);
  return await res.json();
}

/* ==============================
   ❓ TRIVIA API
============================== */
export async function getTriviaQuestions(language = "en") {
  const config = await loadConfig();
  const res = await fetch(config.TRIVIA_API_URL);
  const data = await res.json();
  return language === "es" ? await translateQuestions(data.results) : data.results;
}

async function translateQuestions(questions) {
  return questions.map(q => ({
    ...q,
    originalQuestion: q.question,
  }));
}

/* ==============================
   ❤️ FAVORITOS (BACKEND)
============================== */
export async function saveFavorite(pokemon) {
  const config = await loadConfig();
  await fetch(`${config.BACKEND_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemon),
  });
}

export async function deleteFavorite(id) {
  const config = await loadConfig();
  await fetch(`${config.BACKEND_URL}/api/favorites/${id}`, { method: "DELETE" });
}

export async function getFavoritesFromServer() {
  const config = await loadConfig();
  const res = await fetch(`${config.BACKEND_URL}/api/favorites`);
  return await res.json();
}

/* ==============================
   👤 LOGIN CON STRAPI
============================== */
export async function loginUser(email, password) {
  const data = await loginStrapi(email, password);
  if (data?.jwt && data?.user) {
    localStorage.setItem("strapiToken", data.jwt);
    localStorage.setItem("auth", JSON.stringify({ user: data.user, timestamp: new Date().toISOString() }));
    return data.user;
  }
  return null;
}

export function isAuthenticated() {
  const token = localStorage.getItem("strapiToken");
  const auth = localStorage.getItem("auth");
  return !!(token && auth);
}

export function logout() {
  localStorage.removeItem("strapiToken");
  localStorage.removeItem("auth");
}

export function getToken() {
  return localStorage.getItem("strapiToken");
}

/* ==============================
   🌐 CONEXIÓN STRAPI
============================== */
export async function loginStrapi(email, password) {
  const config = await loadConfig();
  try {
    const response = await fetch(`${config.BACKEND_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Error en login");

    return data; // { jwt, user }
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
  }
}
