import { fetchData } from "../api/api.js";

let nextPageUrl = "pokemon?limit=8"; // Página inicial

export async function HomeView() {
  const container = document.createElement("div");
  container.classList.add("home-view");

  const title = document.createElement("h2");
  title.textContent = "Lista de Pokémon";
  container.appendChild(title);

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");
  container.appendChild(cardContainer);

  const button = document.createElement("button");
  button.textContent = "➡️ Cargar más Pokémon";
  button.classList.add("load-btn");
  container.appendChild(button);

  async function loadPokemons() {
    if (!nextPageUrl) {
      button.disabled = true;
      button.textContent = "No hay más Pokémon 😅";
      return;
    }

    const data = await fetchData(nextPageUrl.replace("https://pokeapi.co/api/v2/", ""));

    if (data && data.results) {
      nextPageUrl = data.next;

      for (const pokemon of data.results) {
        const pokeData = await fetchData(`pokemon/${pokemon.name}`);
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
        card.innerHTML = `
          <img src="${pokeData.sprites.front_default}" alt="${pokemon.name}" />
          <h3>${pokemon.name}</h3>
        `;
        cardContainer.appendChild(card);
      }
    }
  }

  // Cargar la primera página automáticamente
  await loadPokemons();

  // Cargar más cuando se hace clic
  button.addEventListener("click", loadPokemons);

  return container;
}

