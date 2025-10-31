import { getUsers, loginStrapi, testStrapiConnection } from './src/api/api.js';
import { initRouter } from './src/routes/router.js';

document.addEventListener('DOMContentLoaded', async () => {
  initRouter();
  // await testStrapiConnection();

  console.log("🚀 Iniciando prueba de login con Strapi...");

  // 👇 Cambia estos datos por los de tu usuario real en Strapi
  const email = "ash-ketchum98@prueba.com";
  const password = "1Q2w3e4r";

  const loginData = await loginStrapi(email, password);

  if (loginData && loginData.jwt) {
    console.log("🔐 Token recibido:", loginData.jwt);
    console.log("👤 Usuario autenticado:", loginData.user);

    // Ahora probamos traer usuarios
    const users = await getUsers(loginData.jwt);
    console.log("✅ Usuarios disponibles:", users);
  } else {
    console.warn("⚠️ No se pudo autenticar el usuario.");
  }

});
