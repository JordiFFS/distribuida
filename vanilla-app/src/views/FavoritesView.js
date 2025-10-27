import { getClaimedPokemons } from '../hooks/useTrivia.js';

export function FavoritesView() {
  const container = document.createElement('section');
  container.classList.add('favorites-container');
  
  const claimedPokemons = getClaimedPokemons();

  container.innerHTML = `
    <h1>💎 Mis Pokémones Reclamados</h1>
    <p class="subtitle">Pokémones que has obtenido con tus puntos de trivia</p>
    <div class="favorites-grid"></div>
  `;

  const grid = container.querySelector('.favorites-grid');

  if (claimedPokemons.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p class="empty-message">😢 Aún no has reclamado ningún Pokémon</p>
        <p class="empty-hint">Completa trivias para ganar puntos y reclamar Pokémones</p>
        <button class="go-trivia-btn">🎯 Ir a Trivia</button>
      </div>
    `;
    
    grid.querySelector('.go-trivia-btn').addEventListener('click', () => {
      window.location.hash = '#/survey';
    });
  } else {
    claimedPokemons.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('card', 'claimed-pokemon-card');
      
      const claimedDate = new Date(pokemon.claimedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      card.innerHTML = `
        <div class="claimed-badge">✅ Reclamado</div>
        <img src="${pokemon.img}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <p class="pokemon-id">ID: ${pokemon.id}</p>
        <p class="pokemon-types">${pokemon.types ? pokemon.types.join(', ') : ''}</p>
        <p class="claimed-date">📅 ${claimedDate}</p>
      `;
      grid.appendChild(card);
    });
  }

  return container;
}