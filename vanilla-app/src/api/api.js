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
// export async function loginUser(username, password) {
//     const config = await loadConfig();

//     console.log('🔐 Intentando login en:', `${config.BACKEND_URL}/api/login`);

//     try {
//         const res = await fetch(`${config.BACKEND_URL}/api/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password }),
//         });

//         console.log('📡 Respuesta del servidor:', res.status, res.statusText);

//         if (!res.ok) {
//             const errorData = await res.json().catch(() => ({}));
//             console.error('❌ Error del servidor:', errorData);
//             return null;
//         }

//         const data = await res.json();
//         console.log('✅ Login exitoso:', data);
//         return data.user;
//     } catch (error) {
//         console.error('❌ Error en la petición de login:', error);
//         return null;
//     }
// }

/* ==============================
   👤 LOGIN CON STRAPI
============================== */
export async function loginUser(email, password) {
    console.log('🔐 Intentando login con Strapi');

    try {
        const data = await loginStrapi(email, password);

        if (data && data.jwt && data.user) {
            // Guardar token en localStorage
            localStorage.setItem('strapiToken', data.jwt);

            // Guardar info del usuario
            localStorage.setItem('auth', JSON.stringify({
                user: data.user,
                timestamp: new Date().toISOString()
            }));

            console.log('✅ Token guardado en localStorage');
            return data.user;
        }

        return null;
    } catch (error) {
        console.error('❌ Error en loginUser:', error);
        return null;
    }
}

/* Función auxiliar para verificar si el usuario está autenticado */
export function isAuthenticated() {
    const token = localStorage.getItem('strapiToken');
    const auth = localStorage.getItem('auth');
    return !!(token && auth);
}

/* Función para cerrar sesión */
export function logout() {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('auth');
    console.log('👋 Sesión cerrada');
}

/* Función para obtener el token actual */
export function getToken() {
    return localStorage.getItem('strapiToken');
}

/* ==============================
   🔄 UTILIDAD: Refrescar configuración
============================== */
export function resetConfig() {
    CONFIG = null;
}

/* ==============================
   🌐 CONEXIÓN CON STRAPI
============================== */
export async function testStrapiConnection() {
    const config = await loadConfig();

    // URL base de tu Strapi local (puedes ajustarla si usas Docker)
    const strapiUrl = 'http://localhost:1337/admin';

    try {
        const res = await fetch(strapiUrl);
        if (res.ok) {
            console.log('✅ Conectado con Strapi correctamente');
        } else {
            console.warn('⚠️ Strapi respondió, pero con un estado no exitoso:', res.status);
        }
    } catch (error) {
        console.error('❌ Error al conectar con Strapi:', error);
    }
}

// src/api/api.js

const STRAPI_URL = "http://localhost:1337/api";

/**
 * Inicia sesión en Strapi usando email y contraseña.
 * Devuelve el token JWT y la información del usuario.
 */
export async function loginStrapi(email, password) {
    try {
        const response = await fetch(`${STRAPI_URL}/auth/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier: email, // Strapi usa 'identifier' en lugar de 'email'
                password: password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Error en el login");
        }

        console.log("✅ Login exitoso. Datos recibidos:", data);
        return data; // { jwt, user }
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error.message);
    }
}

/**
 * Ejemplo para traer los usuarios (requiere token JWT)
 */
export async function getUsers(token) {
    try {
        const response = await fetch(`${STRAPI_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log("👥 Usuarios obtenidos desde Strapi:", data);
        return data;
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
    }
}
