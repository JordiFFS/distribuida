export function Navbar() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar');

    const auth = JSON.parse(localStorage.getItem('auth'));
    const username = auth?.username || 'Usuario';

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

    // Evento de cerrar sesión
    nav.querySelector('#logout-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.removeItem('auth');
            window.location.hash = '#/login';
        }
    });

    return nav;
}