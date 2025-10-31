export const ENV = {
    // 🌐 APIs
    POKEMON_API_URL: 'https://pokeapi.co/api/v2/pokemon',
    TRIVIA_API_URL: 'https://opentdb.com/api.php?amount=50&category=21',
    
    // ⚙️ Backend
    BACKEND_URL: 'https://strapi-backend-az7o.onrender.com',
    STRAPI_URL: 'https://strapi-backend-az7o.onrender.com',
    
    // 📱 App
    APP_NAME: 'VanillaApp',
    
    // 🔧 Modo de desarrollo
    isDevelopment: window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1'
};

// Función para obtener la URL del backend según el entorno
export function getBackendUrl() {
    return ENV.isDevelopment 
        ? 'http://localhost:1337'  // Strapi local
        : ENV.BACKEND_URL;          // Strapi en producción
}

// Log de configuración cargada
console.log('⚙️ Configuración cargada:', ENV);