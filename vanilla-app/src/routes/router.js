import { HomeView } from '../views/HomeView.js';
import { LoginView } from '../views/LoginView.js';
import { SurveyView } from '../views/SurveyView.js';
import { FavoritesView } from '../views/FavoritesView.js';
import { ClaimView } from '../views/ClaimView.js';
import { HelloView } from '../views/HelloView.js'; // ⬅️ Nueva vista
import { Navbar } from '../Layout/Navbar.js';
import { isAuthenticated } from '../api/api.js';

export function initRouter() {
  window.addEventListener('hashchange', loadRoute);
  loadRoute();
}

function loadRoute() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const route = window.location.hash || '#/login';

  // Limpiar clases del body
  document.body.className = '';

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['#/login', '#/hello'];
  
  if (!isAuthenticated() && !publicRoutes.includes(route)) {
    window.location.hash = '#/login';
    return;
  }

  // Cargar estilos dinámicos según la ruta
  const dynamicStyles = document.getElementById('dynamic-styles');

  switch (route) {
    case '#/home':
      dynamicStyles.href = '/src/styles/home.css';
      document.body.classList.add('home-page');
      app.appendChild(Navbar());
      app.appendChild(HomeView());
      break;

    case '#/survey':
      dynamicStyles.href = '/src/styles/survey.css';
      document.body.classList.add('survey-page');
      app.appendChild(Navbar());
      app.appendChild(SurveyView());
      break;

    case '#/favorites':
      dynamicStyles.href = '/src/styles/home.css';
      document.body.classList.add('favorites-page');
      app.appendChild(Navbar());
      app.appendChild(FavoritesView());
      break;

    case '#/claim':
      dynamicStyles.href = '/src/styles/claim.css';
      document.body.classList.add('claim-page');
      app.appendChild(Navbar());
      app.appendChild(ClaimView());
      break;

    // ⬇️ Nueva ruta para Hola Mundo
    case '#/hello':
      dynamicStyles.href = '/src/styles/hello.css'; // Reutiliza estilos o crea hello.css
      document.body.classList.add('hello-page');
      app.appendChild(Navbar());
      app.appendChild(HelloView());
      break;

    case '#/login':
    default:
      dynamicStyles.href = '/src/styles/login.css';
      document.body.classList.add('login-page');
      app.appendChild(LoginView());
      break;
  }
}