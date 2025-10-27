import { getTrivia, getTriviaScore, updateTriviaScore, getCurrentLanguage, setCurrentLanguage } from '../hooks/useTrivia.js';

export function SurveyView() {
  const container = document.createElement('section');
  container.classList.add('trivia-container');
  
  let questions = [];
  let currentQuestionIndex = 0;
  let score = getTriviaScore();
  let currentLanguage = getCurrentLanguage();

  container.innerHTML = `
    <div class="trivia-header">
      <h1>🎯 ${currentLanguage === 'es' ? 'Trivia' : 'Trivia'}</h1>
      
      <div class="header-controls">
        <div class="score-display">
          <span class="score-label">${currentLanguage === 'es' ? 'Puntos totales:' : 'Total Points:'}</span>
          <span class="score-value">${score}</span>
          <span class="coins">⭐</span>
        </div>
        
        <button class="language-toggle" id="language-toggle">
          <span class="flag">${currentLanguage === 'es' ? '🇬🇧 English' : '🇪🇸 Español'}</span>
        </button>
      </div>
    </div>

    <div class="trivia-content">
      <div class="loading-state">
        <p>${currentLanguage === 'es' ? 'Cargando preguntas...' : 'Loading questions...'}</p>
      </div>
    </div>
  `;

  const content = container.querySelector('.trivia-content');
  const scoreDisplay = container.querySelector('.score-value');
  const languageToggle = container.querySelector('#language-toggle');

  // Evento para cambiar idioma
  languageToggle.addEventListener('click', async () => {
    const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLanguage);
    
    // Mostrar mensaje de carga
    languageToggle.disabled = true;
    languageToggle.innerHTML = `<span class="flag">⏳ ${currentLanguage === 'es' ? 'Cambiando...' : 'Changing...'}</span>`;
    
    // Recargar la vista
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });

  async function loadTrivia() {
    content.innerHTML = `
      <div class="loading-state">
        <p>${currentLanguage === 'es' ? '⏳ Traduciendo preguntas...' : '⏳ Translating questions...'}</p>
        <small>${currentLanguage === 'es' ? 'Esto puede tardar unos segundos' : 'This may take a few seconds'}</small>
      </div>
    `;
    
    questions = await getTrivia();
    
    if (questions.length === 0) {
      content.innerHTML = `
        <div class="error-state">
          <p>❌ ${currentLanguage === 'es' ? 'No se pudieron cargar las preguntas' : 'Could not load questions'}</p>
          <button class="retry-btn">${currentLanguage === 'es' ? 'Reintentar' : 'Retry'}</button>
        </div>
      `;
      content.querySelector('.retry-btn').addEventListener('click', loadTrivia);
      return;
    }

    questions = shuffleArray(questions);
    showQuestion();
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showCompletionScreen();
      return;
    }

    const question = questions[currentQuestionIndex];
    const allAnswers = shuffleArray([
      question.respuesta_correcta,
      ...question.respuestas_incorrectas
    ]);

    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = questions.length;
    const points = getPointsForDifficulty(question.dificultad);

    const labels = currentLanguage === 'es' 
      ? { question: 'Pregunta', of: 'de' }
      : { question: 'Question', of: 'of' };

    content.innerHTML = `
      <div class="question-card">
        <div class="question-header">
          <span class="question-number">${labels.question} ${questionNumber} ${labels.of} ${totalQuestions}</span>
          <span class="question-difficulty difficulty-${question.dificultad}">
            ${question.dificultad.toUpperCase()} (+${points}⭐)
          </span>
        </div>
        
        <div class="question-category">📂 ${question.categoria}</div>
        
        <h2 class="question-text">${question.pregunta}</h2>
        
        <div class="answers-container ${question.tipo === 'booleano' || question.tipo === 'boolean' ? 'boolean-answers' : ''}">
          ${allAnswers.map((answer, index) => `
            <button class="answer-btn" data-answer="${answer}">
              ${(question.tipo === 'booleano' || question.tipo === 'boolean') ? 
                (answer.toLowerCase().includes('true') || answer.toLowerCase().includes('verdadero') ? '✅' : '❌') 
                : ''} 
              ${answer}
            </button>
          `).join('')}
        </div>

        <div class="question-feedback"></div>
      </div>
    `;

    content.querySelectorAll('.answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleAnswer(e.target.dataset.answer, question));
    });
  }

  function handleAnswer(selectedAnswer, question) {
    const buttons = content.querySelectorAll('.answer-btn');
    const feedback = content.querySelector('.question-feedback');
    const isCorrect = selectedAnswer === question.respuesta_correcta;
    const points = getPointsForDifficulty(question.dificultad);

    buttons.forEach(btn => {
      btn.disabled = true;
      
      if (btn.dataset.answer === question.respuesta_correcta) {
        btn.classList.add('correct');
      } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });

    const messages = currentLanguage === 'es'
      ? { correct: '¡Correcto! 🎉', incorrect: 'Incorrecto 😞', earned: 'Has ganado', points: 'puntos', correctAnswer: 'La respuesta correcta era:' }
      : { correct: 'Correct! 🎉', incorrect: 'Incorrect 😞', earned: 'You earned', points: 'points', correctAnswer: 'The correct answer was:' };

    if (isCorrect) {
      score = updateTriviaScore(points);
      scoreDisplay.textContent = score;
      feedback.innerHTML = `
        <div class="feedback correct-feedback">
          <strong>${messages.correct}</strong>
          <p>${messages.earned} ${points} ${messages.points} ⭐</p>
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="feedback incorrect-feedback">
          <strong>${messages.incorrect}</strong>
          <p>${messages.correctAnswer} <strong>${question.respuesta_correcta}</strong></p>
        </div>
      `;
    }

    const nextText = currentLanguage === 'es'
      ? (currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados 🏆')
      : (currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'View Results 🏆');

    setTimeout(() => {
      feedback.innerHTML += `
        <button class="next-question-btn">${nextText}</button>
      `;
      
      feedback.querySelector('.next-question-btn').addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion();
      });
    }, 1500);
  }

  function showCompletionScreen() {
    const messages = currentLanguage === 'es'
      ? { completed: '🏆 ¡Trivia Completada!', totalPoints: 'Puntos totales acumulados:', claim: '💎 Reclamar Pokémones', retry: '🔄 Nueva Trivia' }
      : { completed: '🏆 Trivia Completed!', totalPoints: 'Total accumulated points:', claim: '💎 Claim Pokémon', retry: '🔄 New Trivia' };

    content.innerHTML = `
      <div class="completion-screen">
        <h2>${messages.completed}</h2>
        <div class="final-score">
          <p>${messages.totalPoints}</p>
          <span class="big-score">${score} ⭐</span>
        </div>
        <div class="completion-actions">
          <button class="claim-btn">${messages.claim}</button>
          <button class="retry-btn">${messages.retry}</button>
        </div>
      </div>
    `;

    content.querySelector('.claim-btn').addEventListener('click', () => {
      window.location.hash = '#/claim';
    });

    content.querySelector('.retry-btn').addEventListener('click', () => {
      currentQuestionIndex = 0;
      loadTrivia();
    });
  }

  function getPointsForDifficulty(difficulty) {
    const difficultyLower = difficulty.toLowerCase();
    const points = {
      'fácil': 10, 'easy': 10,
      'medio': 20, 'medium': 20,
      'difícil': 30, 'hard': 30
    };
    return points[difficultyLower] || 10;
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  loadTrivia();
  return container;
}