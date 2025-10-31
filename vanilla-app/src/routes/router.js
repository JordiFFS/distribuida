import { HomeView } from '../views/HomeView.js';
import { LoginView } from '../views/LoginView.js';
import { SurveyView } from '../views/SurveyView.js';
import { FavoritesView } from '../views/FavoritesView.js';
import { Navbar } from '../Layout/Navbar.js';
import { ClaimView } from '../views/ClaimView.js';
import { isAuthenticated } from '../api/api.js';

export function initRouter() {
  window.addEventListener('hashchange', loadRoute);
  loadRoute();
}

function loadRoute() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const route = window.location.hash || '#/login';
  // const auth = JSON.parse(localStorage.getItem('auth'));

  // Limpiar clases del body
  document.body.className = '';

  if (!isAuthenticated() && route !== '#/login') {
    window.location.hash = '#/login';
    return;
  }

  // Cargar estilos dinámicos según la ruta
  const dynamicStyles = document.getElementById('dynamic-styles');

  switch (route) {
    case '#/home':
      dynamicStyles.href = '/styles/home.css';
      document.body.classList.add('home-page');
      app.appendChild(Navbar());
      app.appendChild(HomeView());
      break;

    case '#/survey':
      dynamicStyles.href = '/styles/survey.css';
      document.body.classList.add('survey-page');
      app.appendChild(Navbar());
      app.appendChild(SurveyView());
      break;

    case '#/favorites':
      dynamicStyles.href = '/styles/home.css';
      document.body.classList.add('favorites-page');
      app.appendChild(Navbar());
      app.appendChild(FavoritesView());
      break;

    case '#/claim':
      dynamicStyles.href = '/styles/claim.css';
      document.body.classList.add('claim-page');
      app.appendChild(Navbar());
      app.appendChild(ClaimView());
      break;

    case '#/login':
    default:
      dynamicStyles.href = '/styles/login.css';
      document.body.classList.add('login-page');
      app.appendChild(LoginView());
      break;
  }
}