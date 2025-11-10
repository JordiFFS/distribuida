import { getHelloWorld, getSecureHelloWorld, getCurrentUser } from '../api/api.js';

export function HelloView() {
    const container = document.createElement('div');
    container.className = 'hello-container';
    container.innerHTML = `
        <div class="hello-content">
            <h1>🌍 Hola Mundo - Strapi Demo</h1>
            
            <div class="user-info">
                <p>👤 Usuario: <span id="current-user">Cargando...</span></p>
            </div>

            <div class="buttons-section">
                <button id="btn-public" class="btn btn-primary">
                    📡 Llamar Endpoint Público
                </button>
                
                <button id="btn-secure" class="btn btn-success">
                    🔐 Llamar Endpoint Protegido
                </button>

                <button id="btn-both" class="btn btn-info">
                    🧪 Probar Ambos
                </button>
            </div>

            <div class="response-section">
                <h3>📋 Respuesta del Servidor:</h3>
                <div id="response-container" class="response-box">
                    <p class="placeholder">Haz clic en un botón para hacer una petición...</p>
                </div>
            </div>

            <div class="info-section">
                <h4>ℹ️ Información:</h4>
                <ul>
                    <li><strong>Endpoint Público:</strong> No requiere autenticación</li>
                    <li><strong>Endpoint Protegido:</strong> Requiere token JWT</li>
                    <li>Los datos se obtienen desde tu backend Strapi</li>
                </ul>
            </div>
        </div>
    `;

    // Mostrar usuario actual
    const user = getCurrentUser();
    const userSpan = container.querySelector('#current-user');
    if (user) {
        userSpan.textContent = `${user.username} (${user.email})`;
    } else {
        userSpan.textContent = 'No autenticado';
    }

    // Funciones auxiliares
    function showLoading() {
        const responseContainer = container.querySelector('#response-container');
        responseContainer.innerHTML = '<p class="loading">⏳ Cargando...</p>';
    }

    function showResponse(data, type = 'success') {
        const responseContainer = container.querySelector('#response-container');
        responseContainer.innerHTML = `
            <div class="response-${type}">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }

    function showError(error) {
        const responseContainer = container.querySelector('#response-container');
        responseContainer.innerHTML = `
            <div class="response-error">
                <p><strong>❌ Error:</strong></p>
                <p>${error.message || error}</p>
            </div>
        `;
    }

    // Event listeners
    container.querySelector('#btn-public').addEventListener('click', async () => {
        showLoading();
        try {
            const data = await getHelloWorld();
            showResponse(data, 'success');
        } catch (error) {
            showError(error);
        }
    });

    container.querySelector('#btn-secure').addEventListener('click', async () => {
        showLoading();
        try {
            const data = await getSecureHelloWorld();
            showResponse(data, 'success');
        } catch (error) {
            showError(error);
        }
    });

    container.querySelector('#btn-both').addEventListener('click', async () => {
        showLoading();
        try {
            const publicData = await getHelloWorld();
            const secureData = await getSecureHelloWorld();

            showResponse({
                public: publicData,
                secure: secureData
            }, 'success');
        } catch (error) {
            showError(error);
        }
    });

    return container;
}