let ENV = {};

export function loadEnv() {
  return fetch('./.env')
    .then((res) => res.text())
    .then((text) => {
      text.split('\n').forEach((line) => {
        const [key, ...rest] = line.split('=');
        if (!key || key.startsWith('#')) return;
        const value = rest.join('=').trim();
        if (key && value) ENV[key.trim()] = value;
      });
    });
}

/* ==============================
   🧩 POKÉMON API
============================== */
export async function getPokemons(limit = 20, offset = 0) {
  const url = `${ENV.POKEMON_API_URL}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

export async function getPokemonDetails(url) {
  const res = await fetch(url);
  return await res.json();
}

/* ==============================
   ❓ TRIVIA API
============================== */
export async function getTriviaQuestions() {
  const res = await fetch(ENV.TRIVIA_API_URL);
  const data = await res.json();
  return data.results;
}

/* ==============================
   ❤️ FAVORITOS (BACKEND)
============================== */
export async function saveFavorite(pokemon) {
  await fetch(`${ENV.BACKEND_URL}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pokemon),
  });
}

export async function deleteFavorite(id) {
  await fetch(`${ENV.BACKEND_URL}/api/favorites/${id}`, { method: 'DELETE' });
}

export async function getFavoritesFromServer() {
  const res = await fetch(`${ENV.BACKEND_URL}/api/favorites`);
  return await res.json();
}

/* ==============================
   👤 USUARIOS DE EJEMPLO
============================== */
/* export async function getUsers() {
  const response = await fetch(`${ENV.BACKEND_URL}/data/users.json`);
  return await response.json();
}
 */
export async function loginUser(username, password) {
  const res = await fetch(`${ENV.BACKEND_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user; // o data.token, según tu backend
}