import { getPokemons, getPokemonDetails } from '../api/api.js';

export function HomeView() {
  const container = document.createElement('section');
  container.classList.add('pokemon-container');
  container.innerHTML = `
    <h1>Pokémon List</h1>
    <div class="search-bar">
      <input type="text" id="search" placeholder="Buscar Pokémon..." />
    </div>
    <div class="buttons">
      <button id="prev" disabled>⬅️ Anterior</button>
      <button id="next">Siguiente ➡️</button>
    </div>
    <div class="grid"></div>
  `;

  const grid = container.querySelector('.grid');
  const searchInput = container.querySelector('#search');
  const prevBtn = container.querySelector('#prev');
  const nextBtn = container.querySelector('#next');

  let offset = 0;
  const limit = 20;
  let allPokemons = []; // almacenará todos los pokémon cargados
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  async function loadPokemons() {
    grid.innerHTML = `<p>Cargando...</p>`;
    const pokemons = await getPokemons(limit, offset);
    allPokemons = pokemons;
    grid.innerHTML = '';
    await renderPokemons(pokemons);
    prevBtn.disabled = offset === 0;
  }

  async function renderPokemons(list) {
    grid.innerHTML = '';
    for (const pokemon of list) {
      const details = await getPokemonDetails(pokemon.url);
      const card = document.createElement('div');
      card.classList.add('card');
      const isFav = favorites.some(f => f.id === details.id);

      card.innerHTML = `
        <img src="${details.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <p>ID: ${details.id}</p>
        <p>Tipo: ${details.types.map(t => t.type.name).join(', ')}</p>
        <button class="fav-btn" data-id="${details.id}">
          ${isFav ? '💛 Favorito' : '🤍 Agregar a favoritos'}
        </button>
      `;
      grid.appendChild(card);
    }

    // asignar eventos a los botones de favoritos
    grid.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        toggleFavorite(id);
      });
    });
  }

  function toggleFavorite(id) {
    const existing = favorites.find(f => f.id === id);
    if (existing) {
      favorites = favorites.filter(f => f.id !== id);
    } else {
      const card = grid.querySelector(`[data-id="${id}"]`).closest('.card');
      const name = card.querySelector('h3').textContent;
      const img = card.querySelector('img').src;
      favorites.push({ id, name, img });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderPokemons(allPokemons);
  }

  // Control de paginación
  nextBtn.addEventListener('click', () => {
    offset += limit;
    loadPokemons();
  });

  prevBtn.addEventListener('click', () => {
    if (offset >= limit) {
      offset -= limit;
      loadPokemons();
    }
  });

  // Búsqueda dinámica
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    clearTimeout(searchTimeout);
    if (query.length < 2) {
      renderPokemons(allPokemons);
      return;
    }

    searchTimeout = setTimeout(async () => {
      const filtered = allPokemons.filter(p => p.name.toLowerCase().includes(query));
      await renderPokemons(filtered);
    }, 400); // espera 400ms antes de filtrar
  });

  loadPokemons();
  return container;
}
