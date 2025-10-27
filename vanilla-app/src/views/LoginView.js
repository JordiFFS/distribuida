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
    <p id="loginLoading" style="display:none; color:blue;">Verificando credenciales...</p>
  `;

    const form = container.querySelector('#loginForm');
    const errorMsg = container.querySelector('#loginError');
    const loadingMsg = container.querySelector('#loginLoading');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = container.querySelector('#username').value;
        const password = container.querySelector('#password').value;

        console.log('🔐 Iniciando proceso de login...');
        console.log('👤 Usuario:', username);

        // Mostrar mensaje de carga
        errorMsg.style.display = 'none';
        loadingMsg.style.display = 'block';

        try {
            const user = await loginUser(username, password);
            
            loadingMsg.style.display = 'none';

            if (user) {
                console.log('✅ Login exitoso, usuario:', user);
                localStorage.setItem('auth', JSON.stringify(user));
                
                console.log('🔄 Redirigiendo a home...');
                window.location.hash = '#/home';
            } else {
                console.error('❌ Login falló: usuario null');
                errorMsg.textContent = 'Usuario o contraseña incorrectos';
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            console.error('❌ Error en login:', err);
            loadingMsg.style.display = 'none';
            errorMsg.textContent = 'Error al conectar con el servidor. Intenta de nuevo.';
            errorMsg.style.display = 'block';
        }
    });

    return container;
}