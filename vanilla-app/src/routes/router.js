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

  if (!auth && route !== '#/login') {
    window.location.hash = '#/login';
    return;
  }

  switch (route) {
    case '#/home':
      app.appendChild(HomeView());
      break;
    case '#/login':
    default:
      app.appendChild(LoginView());
      break;
  }
}
