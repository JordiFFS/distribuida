import { getTriviaQuestions } from '../api/api.js';
import { translateQuestions } from '../utils/translator.js';

// Obtener idioma guardado o usar español por defecto
export function getCurrentLanguage() {
  return localStorage.getItem('triviaLanguage') || 'es';
}

export function setCurrentLanguage(lang) {
  localStorage.setItem('triviaLanguage', lang);
}

export async function getTrivia(forceLanguage = null) {
  try {
    const language = forceLanguage || getCurrentLanguage();
    const questions = await getTriviaQuestions();
    
    if (language === 'es') {
      // Traducir al español
      return await translateQuestions(questions, 'es');
    } else {
      // Devolver en inglés (formato original adaptado)
      return questions.map(q => ({
        tipo: q.type === 'boolean' ? 'boolean' : 'multiple',
        dificultad: q.difficulty,
        categoria: q.category,
        pregunta: decodeHTML(q.question),
        respuesta_correcta: decodeHTML(q.correct_answer),
        respuestas_incorrectas: q.incorrect_answers.map(a => decodeHTML(a))
      }));
    }
  } catch (error) {
    console.error('Error al cargar trivia:', error);
    return [];
  }
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function getTriviaScore() {
  return parseInt(localStorage.getItem('triviaScore')) || 0;
}

export function updateTriviaScore(points) {
  const currentScore = getTriviaScore();
  const newScore = currentScore + points;
  localStorage.setItem('triviaScore', newScore);
  return newScore;
}

export function getClaimedPokemons() {
  return JSON.parse(localStorage.getItem('claimedPokemons')) || [];
}

export function claimPokemon(pokemon, cost) {
  const currentScore = getTriviaScore();
  if (currentScore < cost) {
    return { success: false, message: 'No tienes suficientes puntos' };
  }
  
  const claimed = getClaimedPokemons();
  const alreadyClaimed = claimed.some(p => p.id === pokemon.id);
  
  if (alreadyClaimed) {
    return { success: false, message: 'Ya reclamaste este Pokémon' };
  }
  
  updateTriviaScore(-cost);
  claimed.push({...pokemon, claimedAt: new Date().toISOString()});
  localStorage.setItem('claimedPokemons', JSON.stringify(claimed));
  
  return { success: true, message: 'Pokémon reclamado exitosamente', newScore: getTriviaScore() };
}