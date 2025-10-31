/* ==============================
   🌍 CONFIGURACIÓN DINÁMICA
============================== */
import { ENV } from '../config/env.js';

const STRAPI_URL = ENV.STRAPI_URL;
const POKEMON_API_URL = ENV.POKEMON_API_URL;
const TRIVIA_API_URL = ENV.TRIVIA_API_URL;
const BACKEND_URL = ENV.BACKEND_URL;
const APP_NAME = ENV.APP_NAME;

let CONFIG = null;

// Cargar configuración
async function loadConfig() {
    if (!CONFIG) {
        CONFIG = {
            POKEMON_API_URL,
            TRIVIA_API_URL,
            BACKEND_URL,
            STRAPI_URL,
            APP_NAME
        };
        console.log('✅ Configuración cargada:', CONFIG);
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
    const res = await fetch(config.TRIVIA_API_URL);
    const data = await res.json();

    if (language === 'es') {
        return await translateQuestions(data.results);
    }

    return data.results;
}

async function translateQuestions(questions) {
    return questions.map(q => ({
        ...q,
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

/* Función para obtener usuario actual */
export function getCurrentUser() {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).user : null;
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

    try {
        const res = await fetch(`${config.STRAPI_URL}/admin`);
        if (res.ok) {
            console.log('✅ Conectado con Strapi correctamente');
        } else {
            console.warn('⚠️ Strapi respondió, pero con un estado no exitoso:', res.status);
        }
    } catch (error) {
        console.error('❌ Error al conectar con Strapi:', error);
    }
}

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
                identifier: email,
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
        throw error;
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
        throw error;
    }
}