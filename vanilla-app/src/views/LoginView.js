import { loginUser } from '../api/api.js';

export function LoginView() {
    const container = document.createElement('div');
    container.classList.add('login-container');

    container.innerHTML = `
    <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="PokeAPI Logo" style="width:100px; margin-bottom:15px;">
    <h2>Iniciar Sesión</h2>
    <form id="loginForm">
      <input type="text" id="username" placeholder="Usuario" required />
      <input type="password" id="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <p id="loginError" style="display:none; color:red;">Usuario o contraseña incorrectos</p>
  `;

    const form = container.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = container.querySelector('#username').value;
        const password = container.querySelector('#password').value;

        try {
            const user = await loginUser(username, password);
            if (user) {
                localStorage.setItem('auth', JSON.stringify(user));
                window.location.hash = '#/home';
            } else {
                container.querySelector('#loginError').style.display = 'block';
            }
        } catch (err) {
            console.error('❌ Error en login:', err);
            container.querySelector('#loginError').style.display = 'block';
        }
    });

    return container;
}
