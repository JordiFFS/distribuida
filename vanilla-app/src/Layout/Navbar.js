import { logout } from '../api/api.js';

export function Navbar() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar');

    // ✅ Cambio: Obtener datos del usuario desde Strapi
    const auth = JSON.parse(localStorage.getItem('auth'));
    const username = auth?.user?.username || auth?.user?.email || 'Usuario';

    nav.innerHTML = `
    <div class="navbar-container">
        <div class="navbar-brand">
            <span class="logo">⚡ PokéApp</span>
        </div>
        <ul class="navbar-menu">
            <li><a href="#/home" class="nav-link" data-route="home">🎮 Pokémones</a></li>
            <li><a href="#/survey" class="nav-link" data-route="survey">📝 Encuesta</a></li>
            <li><a href="#/favorites" class="nav-link" data-route="favorites">💛 Mis Pokémones</a></li>
            <li><button id="logout-btn" class="logout-btn">🚪 Cerrar Sesión</button></li>
        </ul>
    </div>
  `;

    // Marcar el enlace activo
    const currentRoute = window.location.hash.replace('#/', '') || 'home';
    nav.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.route === currentRoute) {
            link.classList.add('active');
        }
    });

    // ✅ Cambio: Evento de cerrar sesión usando la función logout()
    nav.querySelector('#logout-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            logout(); // Limpia tanto 'auth' como 'strapiToken'
            window.location.hash = '#/login';
        }
    });

    return nav;
}