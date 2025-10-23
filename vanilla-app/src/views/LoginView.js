import { getUsers } from '../api/api.js';

export function LoginView() {
    const container = document.createElement('div');
    container.classList.add('login-container');

    container.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" 
             alt="PokeAPI Logo" 
             style="width:100px; margin-bottom:15px;">
        <h2>Iniciar Sesión</h2>
        <form id="loginForm">
            <input type="text" id="username" placeholder="Usuario" required />
            <input type="password" id="password" placeholder="Contraseña" required />
            <button type="submit">Entrar</button>
        </form>
        <p id="loginError" style="display:none; color:red;">Usuario o contraseña incorrectos</p>
        <p id="loadError" style="display:none; color:red;">Error al cargar el sistema de login</p>
    `;

    // Cargar los usuarios
    getUsers()
        .then((users) => {
            console.log('✅ Usuarios cargados:', users);
            
            container.querySelector('#loginForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const username = container.querySelector('#username').value;
                const password = container.querySelector('#password').value;

                const userFound = users.find(
                    (u) => u.username === username && u.password === password
                );

                if (userFound) {
                    localStorage.setItem('auth', JSON.stringify(userFound));
                    window.location.hash = '#/home';
                } else {
                    container.querySelector('#loginError').style.display = 'block';
                }
            });
        })
        .catch((err) => {
            console.error('❌ Error al cargar los usuarios:', err);
            container.querySelector('#loadError').style.display = 'block';
        });

    return container;
}