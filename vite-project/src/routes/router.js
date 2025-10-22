import { HomeView } from "../views/HomeView.js";
import { LoginView } from "../views/LoginView.js";

const routes = {
  "/": LoginView,
  "/login": HomeView,
};

export async function router() {
  const path = window.location.pathname;
  const viewFunc = routes[path] || HomeView;
  const view = await viewFunc();

  const app = document.querySelector("#app");
  app.innerHTML = "";
  app.appendChild(view);
}
