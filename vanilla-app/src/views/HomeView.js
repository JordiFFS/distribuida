import { getPokemons, getPokemonDetails } from '../api/api.js';

export function HomeView() {
  const container = document.createElement('section');
  container.classList.add('pokemon-container');
  container.innerHTML = `
    <h1>Pokémon List</h1>
    <div class="search-bar">
      <input type="text" id="search" placeholder="Buscar Pokémon por nombre o ID..." />
      <button id="search-btn" class="search-btn">🔍 Buscar</button>
    </div>
    <div class="search-info"></div>
    <div class="buttons">
      <button id="prev" disabled>⬅️ Anterior</button>
      <button id="next">Siguiente ➡️</button>
    </div>
    <div class="grid"></div>
  `;

  const grid = container.querySelector('.grid');
  const searchInput = container.querySelector('#search');
  const searchBtn = container.querySelector('#search-btn');
  const searchInfo = container.querySelector('.search-info');
  const prevBtn = container.querySelector('#prev');
  const nextBtn = container.querySelector('#next');

  let offset = 0;
  const limit = 20;
  let allPokemons = [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let isSearchMode = false;

  async function loadPokemons() {
    grid.innerHTML = `<p>Cargando...</p>`;
    searchInfo.innerHTML = '';
    const pokemons = await getPokemons(limit, offset);
    allPokemons = pokemons;
    grid.innerHTML = '';
    await renderPokemons(pokemons);
    prevBtn.disabled = offset === 0;
    isSearchMode = false;
  }

  async function renderPokemons(list) {
    grid.innerHTML = '';
    
    if (list.length === 0) {
      grid.innerHTML = '<p class="no-results">😢 No se encontraron pokémones</p>';
      return;
    }

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
        `;
      grid.appendChild(card);
    }
        // <button class="fav-btn" data-id="${details.id}">
        //   ${isFav ? '💛 Favorito' : '🤍 Agregar a favoritos'}
        // </button>

    // Asignar eventos a los botones de favoritos
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

  // Búsqueda global por nombre o ID
  async function searchPokemon(query) {
    if (!query || query.trim().length === 0) {
      loadPokemons();
      return;
    }

    grid.innerHTML = '<p>🔍 Buscando...</p>';
    searchInfo.innerHTML = '';
    
    const searchTerm = query.trim().toLowerCase();
    
    try {
      // Intentar buscar por nombre o ID directo
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      
      if (response.ok) {
        // Encontrado directamente
        const pokemon = await response.json();
        searchInfo.innerHTML = `<p class="search-success">✅ Pokémon encontrado</p>`;
        await renderPokemons([{
          name: pokemon.name,
          url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
        }]);
        isSearchMode = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
      } else {
        // Si no se encuentra directo, buscar en la lista completa
        await searchInAllPokemons(searchTerm);
      }
    } catch (error) {
      // Si falla la búsqueda directa, buscar en la lista
      await searchInAllPokemons(searchTerm);
    }
  }

  // Buscar en todos los pokémones (hasta 1000)
  async function searchInAllPokemons(query) {
    grid.innerHTML = '<p>🔍 Buscando en toda la Pokédex...</p>';
    
    try {
      // Obtener lista completa de pokémones (nombres)
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      
      // Filtrar por nombre que contenga el query
      const matches = data.results.filter(p => 
        p.name.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchInfo.innerHTML = `<p class="search-error">❌ No se encontraron pokémones con "${query}"</p>`;
        grid.innerHTML = '<p class="no-results">😢 Intenta con otro nombre o ID</p>';
        return;
      }

      searchInfo.innerHTML = `<p class="search-success">✅ ${matches.length} pokémon(es) encontrado(s)</p>`;
      
      // Limitar resultados a 20 para no sobrecargar
      const limitedMatches = matches.slice(0, 20);
      await renderPokemons(limitedMatches);
      
      if (matches.length > 20) {
        searchInfo.innerHTML += `<p class="search-hint">📌 Mostrando primeros 20 de ${matches.length} resultados</p>`;
      }
      
      isSearchMode = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      searchInfo.innerHTML = '<p class="search-error">❌ Error al buscar. Intenta de nuevo.</p>';
      grid.innerHTML = '';
    }
  }

  // Limpiar búsqueda
  function clearSearch() {
    searchInput.value = '';
    searchInfo.innerHTML = '';
    isSearchMode = false;
    loadPokemons();
  }

  // Control de paginación
  nextBtn.addEventListener('click', () => {
    if (!isSearchMode) {
      offset += limit;
      loadPokemons();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (!isSearchMode && offset >= limit) {
      offset -= limit;
      loadPokemons();
    }
  });

  // Evento del botón de búsqueda
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    searchPokemon(query);
  });

  // Búsqueda al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value;
      searchPokemon(query);
    }
  });

  // Búsqueda dinámica (opcional - buscar mientras escribe)
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    clearTimeout(searchTimeout);
    
    // Si borra todo, volver a la lista normal
    if (query.length === 0) {
      clearSearch();
      return;
    }

    // Si está en modo búsqueda y escribe, filtrar los resultados actuales
    if (isSearchMode && query.length >= 2) {
      searchTimeout = setTimeout(() => {
        const filtered = allPokemons.filter(p => 
          p.name.toLowerCase().includes(query)
        );
        renderPokemons(filtered);
      }, 400);
    }
  });

  loadPokemons();
  return container;
}