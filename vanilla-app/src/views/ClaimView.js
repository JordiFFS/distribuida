import { getTriviaScore, claimPokemon, getClaimedPokemons } from '../hooks/useTrivia.js';
import { getPokemons, getPokemonDetails } from '../api/api.js';

export function ClaimView() {
  const container = document.createElement('section');
  container.classList.add('claim-container');

  const currentScore = getTriviaScore();
  const claimedPokemons = getClaimedPokemons();

  container.innerHTML = `
    <div class="claim-header">
      <h1>💎 Reclamar Pokémones</h1>
      <div class="score-display">
        <span class="score-label">Puntos disponibles:</span>
        <span class="score-value">${currentScore}</span>
        <span class="coins">⭐</span>
      </div>
    </div>

    <div class="claimed-section">
      <h2>🎁 Pokémones Reclamados (${claimedPokemons.length})</h2>
      <div class="claimed-grid"></div>
    </div>

    <div class="available-section">
      <h2>🛒 Pokémones Disponibles</h2>
      <div class="filters">
        <label>
          Ordenar por:
          <select id="sort-select">
            <option value="cost-asc">Precio (menor a mayor)</option>
            <option value="cost-desc">Precio (mayor a menor)</option>
            <option value="rarity">Rareza</option>
          </select>
        </label>
      </div>
      <div class="available-grid">Cargando pokémones...</div>
    </div>

    <div class="load-more-container">
    <button class="load-more-btn" id="load-more-btn">
      🔄 Cargar más Pokémon
    </button>
  </div>
  `;

  const claimedGrid = container.querySelector('.claimed-grid');
  const availableGrid = container.querySelector('.available-grid');
  const scoreDisplay = container.querySelector('.score-value');
  const sortSelect = container.querySelector('#sort-select');

  // Mostrar pokémones reclamados
  if (claimedPokemons.length === 0) {
    claimedGrid.innerHTML = '<p class="empty-message">Aún no has reclamado ningún Pokémon</p>';
  } else {
    claimedPokemons.forEach(pokemon => {
      const card = createClaimedCard(pokemon);
      claimedGrid.appendChild(card);
    });
  }

  // Cargar pokémones disponibles
  let availablePokemons = [];

  async function loadAvailablePokemons(append = false) {
    const loadMoreBtn = container.querySelector('#load-more-btn');

    if (!append) {
      availableGrid.innerHTML = '<p>Cargando...</p>';
    } else {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = '⏳ Cargando...';
    }

    // Cargar pokémones aleatorios (puedes ajustar la cantidad)
    const offset = Math.floor(Math.random() * 800);
    const pokemons = await getPokemons(12, offset);

    const newPokemons = await Promise.all(
      pokemons.map(async (p) => {
        const details = await getPokemonDetails(p.url);
        return {
          id: details.id,
          name: details.name,
          img: details.sprites.front_default,
          types: details.types.map(t => t.type.name),
          cost: calculateCost(details),
          rarity: getRarity(details)
        };
      })
    );

    if (append) {
      availablePokemons = [...availablePokemons, ...newPokemons];
    } else {
      availablePokemons = newPokemons;
    }

    renderAvailablePokemons();

    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = '🔄 Cargar más Pokémon';
    }
  }

  function renderAvailablePokemons() {
    availableGrid.innerHTML = '';

    // Ordenar según selección
    const sortValue = sortSelect.value;
    let sorted = [...availablePokemons];

    if (sortValue === 'cost-asc') {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (sortValue === 'cost-desc') {
      sorted.sort((a, b) => b.cost - a.cost);
    } else if (sortValue === 'rarity') {
      const rarityOrder = { común: 0, raro: 1, épico: 2, legendario: 3 };
      sorted.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    }

    sorted.forEach(pokemon => {
      const card = createAvailableCard(pokemon);
      availableGrid.appendChild(card);
    });
  }

  function createClaimedCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card', 'claimed-card');
    card.innerHTML = `
      <img src="${pokemon.img}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <span class="claimed-badge">✅ Reclamado</span>
    `;
    return card;
  }

  function createAvailableCard(pokemon) {
    const card = document.createElement('div');
    const alreadyClaimed = claimedPokemons.some(p => p.id === pokemon.id);
    const canAfford = currentScore >= pokemon.cost;

    card.classList.add('pokemon-card', 'available-card', `rarity-${pokemon.rarity}`);
    if (alreadyClaimed) card.classList.add('already-claimed');
    if (!canAfford) card.classList.add('cannot-afford');

    card.innerHTML = `
      <div class="rarity-badge">${pokemon.rarity.toUpperCase()}</div>
      <img src="${pokemon.img}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <p class="types">${pokemon.types.join(', ')}</p>
      <div class="cost">${pokemon.cost} ⭐</div>
      <button class="claim-pokemon-btn" 
              data-pokemon='${JSON.stringify(pokemon)}'
              ${alreadyClaimed || !canAfford ? 'disabled' : ''}>
        ${alreadyClaimed ? '✅ Ya reclamado' : canAfford ? '💎 Reclamar' : '🔒 Puntos insuficientes'}
      </button>
    `;

    const btn = card.querySelector('.claim-pokemon-btn');
    btn.addEventListener('click', () => handleClaim(pokemon));

    return card;
  }

  function handleClaim(pokemon) {
    const result = claimPokemon(pokemon, pokemon.cost);

    if (result.success) {
      scoreDisplay.textContent = result.newScore;

      // Mostrar notificación
      showNotification(`¡${pokemon.name} reclamado! 🎉`, 'success');

      // Recargar vistas
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      showNotification(result.message, 'error');
    }
  }

  function calculateCost(details) {
    // Calcular costo basado en stats totales
    const totalStats = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    if (totalStats < 300) return 50;
    if (totalStats < 400) return 100;
    if (totalStats < 500) return 150;
    if (totalStats < 600) return 250;
    return 400; // Legendarios
  }

  function getRarity(details) {
    const totalStats = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    if (totalStats < 300) return 'común';
    if (totalStats < 450) return 'raro';
    if (totalStats < 550) return 'épico';
    return 'legendario';
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  sortSelect.addEventListener('change', renderAvailablePokemons);
  const loadMoreBtn = container.querySelector('#load-more-btn');
  loadMoreBtn.addEventListener('click', () => {
    loadAvailablePokemons(true); // true = append (agregar a los existentes)
  });
  loadAvailablePokemons();

  return container;
}