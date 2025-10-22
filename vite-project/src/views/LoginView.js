import { fetchData } from "../api/api.js";

export function LoginView() {
  const container = document.createElement("div");
  container.classList.add("login-view");

  container.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <form id="login-form">
      <div class="form-group">
        <label for="email">Correo:</label>
        <input type="email" id="email" placeholder="Ingresa tu correo" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" placeholder="Ingresa tu contraseña" required />
      </div>
      <button type="submit" class="login-btn">Ingresar</button>
    </form>
    <p id="message"></p>
  `;

  const form = container.querySelector("#login-form");
  const message = container.querySelector("#message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      message.textContent = "⚠️ Debes llenar todos los campos.";
      message.style.color = "red";
      return;
    }

    message.textContent = "🔄 Verificando...";
    message.style.color = "#333";

    const data = await fetchData("login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data && data.token) {
      message.textContent = "✅ Inicio de sesión exitoso";
      message.style.color = "green";

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);

      // Redirigir a otra vista (ejemplo: Home)
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new Event("popstate"));
    } else {
      message.textContent = "❌ Credenciales incorrectas";
      message.style.color = "red";
    }
  });

  return container;
}
