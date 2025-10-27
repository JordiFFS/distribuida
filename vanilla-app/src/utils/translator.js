// MyMemory API - Gratis hasta 1000 palabras/día sin registro
const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

export async function translateText(text, sourceLang = 'en', targetLang = 'es') {
  try {
    // MyMemory tiene un límite de 500 caracteres por request
    if (text.length > 500) {
      text = text.substring(0, 497) + '...';
    }

    const url = `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    
    return text; // Si falla, devolver original
  } catch (error) {
    console.error('Error en traducción:', error);
    return text;
  }
}

// Traducir con delay para no exceder límites
async function translateWithDelay(text, sourceLang, targetLang, delay = 200) {
  await new Promise(resolve => setTimeout(resolve, delay));
  return translateText(text, sourceLang, targetLang);
}

export async function translateQuestions(questions, targetLang = 'es') {
  if (targetLang === 'en') {
    return questions.map(q => ({
      tipo: q.type === 'boolean' ? 'boolean' : 'multiple',
      dificultad: q.difficulty,
      categoria: q.category,
      pregunta: decodeHTML(q.question),
      respuesta_correcta: decodeHTML(q.correct_answer),
      respuestas_incorrectas: q.incorrect_answers.map(a => decodeHTML(a))
    }));
  }

  const translatedQuestions = [];
  
  // Traducir una por una con delay para evitar rate limit
  for (const q of questions) {
    try {
      const pregunta = await translateWithDelay(decodeHTML(q.question), 'en', targetLang);
      const respuestaCorrecta = await translateWithDelay(decodeHTML(q.correct_answer), 'en', targetLang);
      
      const respuestasIncorrectas = [];
      for (const incorrect of q.incorrect_answers) {
        const translated = await translateWithDelay(decodeHTML(incorrect), 'en', targetLang);
        respuestasIncorrectas.push(translated);
      }

      translatedQuestions.push({
        tipo: q.type === 'boolean' ? 'booleano' : 'multiple',
        dificultad: translateDifficulty(q.difficulty, targetLang),
        categoria: q.category,
        pregunta: pregunta,
        respuesta_correcta: respuestaCorrecta,
        respuestas_incorrectas: respuestasIncorrectas
      });
    } catch (error) {
      console.error('Error traduciendo pregunta:', error);
      // Si falla, agregar en inglés
      translatedQuestions.push({
        tipo: q.type === 'boolean' ? 'booleano' : 'multiple',
        dificultad: translateDifficulty(q.difficulty, targetLang),
        categoria: q.category,
        pregunta: decodeHTML(q.question),
        respuesta_correcta: decodeHTML(q.correct_answer),
        respuestas_incorrectas: q.incorrect_answers.map(a => decodeHTML(a))
      });
    }
  }

  return translatedQuestions;
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function translateDifficulty(difficulty, lang) {
  if (lang === 'en') return difficulty;
  
  const translations = {
    'easy': 'fácil',
    'medium': 'medio',
    'hard': 'difícil'
  };
  return translations[difficulty] || difficulty;
}