let ENV = {};

export function loadEnv() {
    return fetch('./.env')
        .then(res => res.text())
        .then(text => {
            text.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) ENV[key.trim()] = value.trim();
            });
        });
}

export async function getPokemons(limit = 20, offset = 0) {
    const response = await fetch(`${ENV.API_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
}

export async function getPokemonDetails(url) {
    const res = await fetch(url);
    return await res.json();
}

export async function saveFavorite(pokemon) {
    await fetch('http://localhost:4000/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon)
    });
}

export async function deleteFavorite(id) {
    await fetch(`http://localhost:4000/api/favorites/${id}`, { method: 'DELETE' });
}

export async function getFavoritesFromServer() {
    const res = await fetch('http://localhost:4000/api/favorites');
    return await res.json();
}
