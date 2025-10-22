import { router } from "./src/routes/router";

export function App() {
  const app = document.createElement("div");
  app.id = "app";

  // Render inicial
  router();

  // Escucha los cambios de ruta (si quieres añadir navegación dinámica)
  window.addEventListener("popstate", router);

  return app;
}
