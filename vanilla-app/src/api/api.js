/* ==============================
   🌍 CONFIGURACIÓN DINÁMICA
============================== */
let CONFIG = null;

// Cargar configuración del backend
async function loadConfig() {
    if (!CONFIG) {
        try {
            const response = await fetch('/api/config');
            CONFIG = await response.json();
            console.log('✅ Configuración cargada:', CONFIG);
        } catch (error) {
            console.error('⚠️ Error al cargar config, usando fallback:', error);
            // Fallback: detectar si estamos en producción o desarrollo
            const isProduction = window.location.hostname !== 'localhost' && 
                                window.location.hostname !== '127.0.0.1';
            
            CONFIG = {
                POKEMON_API_URL: 'https://pokeapi.co/api/v2/pokemon',
                TRIVIA_API_URL: 'https://opentdb.com/api.php?amount=10&type=multiple',
                BACKEND_URL: isProduction ? window.location.origin : 'http://localhost:4000',
                APP_NAME: 'VanillaApp'
            };
            console.log('🔄 Usando configuración fallback:', CONFIG);
        }
    }
    return CONFIG;
}

/* ==============================
   🧩 POKÉMON API
============================== */
export async function getPokemons(limit = 20, offset = 0) {
    const config = await loadConfig();
    const url = `${config.POKEMON_API_URL}?limit=${limit}&offset=${offset}`;
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
export async function getTriviaQuestions(language = 'en') {
    const config = await loadConfig();
    // La API de OpenTDB no soporta español directamente, 
    // así que obtenemos en inglés y traducimos
    const res = await fetch(config.TRIVIA_API_URL);
    const data = await res.json();

    if (language === 'es') {
        // Traducir las preguntas al español
        return await translateQuestions(data.results);
    }

    return data.results;
}

// Función para traducir usando una API de traducción
async function translateQuestions(questions) {
    // Aquí usaremos traducciones predefinidas o una API
    // Por ahora, vamos a crear un sistema de traducción manual
    return questions.map(q => ({
        ...q,
        // Mantenemos el original también por si se quiere cambiar
        originalQuestion: q.question,
        originalCorrect: q.correct_answer,
        originalIncorrect: q.incorrect_answers
    }));
}

/* ==============================
   ❤️ FAVORITOS (BACKEND)
============================== */
export async function saveFavorite(pokemon) {
    const config = await loadConfig();
    await fetch(`${config.BACKEND_URL}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon),
    });
}

export async function deleteFavorite(id) {
    const config = await loadConfig();
    await fetch(`${config.BACKEND_URL}/api/favorites/${id}`, { 
        method: 'DELETE' 
    });
}

export async function getFavoritesFromServer() {
    const config = await loadConfig();
    const res = await fetch(`${config.BACKEND_URL}/api/favorites`);
    return await res.json();
}

/* ==============================
   👤 LOGIN
============================== */
export async function loginUser(username, password) {
    const config = await loadConfig();
    
    console.log('🔐 Intentando login en:', `${config.BACKEND_URL}/api/login`);
    
    try {
        const res = await fetch(`${config.BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        console.log('📡 Respuesta del servidor:', res.status, res.statusText);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Error del servidor:', errorData);
            return null;
        }

        const data = await res.json();
        console.log('✅ Login exitoso:', data);
        return data.user;
    } catch (error) {
        console.error('❌ Error en la petición de login:', error);
        return null;
    }
}

/* ==============================
   🔄 UTILIDAD: Refrescar configuración
============================== */
export function resetConfig() {
    CONFIG = null;
}