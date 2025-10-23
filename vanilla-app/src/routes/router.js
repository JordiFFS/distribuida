import { HomeView } from '../views/HomeView.js';
import { LoginView } from '../views/LoginView.js';

export function initRouter() {
  window.addEventListener('hashchange', loadRoute);
  loadRoute();
}

function loadRoute() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const route = window.location.hash || '#/login';
  const auth = JSON.parse(localStorage.getItem('auth'));

  // Limpiar clases del body
  document.body.className = '';

  if (!auth && route !== '#/login') {
    window.location.hash = '#/login';
    return;
  }

  // Cargar estilos dinámicos según la ruta
  const dynamicStyles = document.getElementById('dynamic-styles');

  switch (route) {
    case '#/home':
      dynamicStyles.href = '/styles/home.css';
      document.body.classList.add('home-page');
      app.appendChild(HomeView());
      break;
    case '#/login':
    default:
      dynamicStyles.href = '/styles/login.css';
      document.body.classList.add('login-page');
      app.appendChild(LoginView());
      break;
  }
}