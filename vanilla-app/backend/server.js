import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { addFavorite, removeFavorite, getFavorites } from './db/favoritesModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log de peticiones
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ==============================
   📡 API ROUTES
============================== */

app.get('/api/config', (req, res) => {
  res.json({
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
    POKEMON_API_URL: process.env.POKEMON_API_URL || 'https://pokeapi.co/api/v2/pokemon',
    TRIVIA_API_URL: process.env.TRIVIA_API_URL || 'https://opentdb.com/api.php?amount=10&type=multiple',
    APP_NAME: process.env.APP_NAME || 'VanillaApp'
  });
});

// 👤 LOGIN
app.post('/api/login', (req, res) => {
  console.log('🔐 Login endpoint called');
  console.log('Body:', req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  const usersPath = path.join(__dirname, '../public/data/users.json');

  console.log('📂 Buscando users.json en:', usersPath);

  if (!fs.existsSync(usersPath)) {
    console.error('❌ Archivo no encontrado');
    return res.status(500).json({ error: 'Archivo de usuarios no encontrado' });
  }

  try {
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    console.log('👥 Usuarios cargados:', usersData.length);

    const user = usersData.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    console.log('✅ Login exitoso:', user.username);
    res.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('❌ Error al leer users.json:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ❤️ FAVORITOS
app.get('/api/favorites', async (req, res) => {
  try {
    const favs = await getFavorites();
    res.json(favs);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    await addFavorite(req.body);
    res.json({ message: 'Favorito agregado' });
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    await removeFavorite(req.params.id);
    res.json({ message: 'Favorito eliminado' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

/* ==============================
   🗂️ ARCHIVOS ESTÁTICOS
============================== */

const rootPath = path.join(__dirname, '..');

app.use('/', express.static(rootPath));

app.use('/styles', express.static(path.join(rootPath, 'styles')));

app.use('/poke', express.static(rootPath));
app.use('/poke/styles', express.static(path.join(rootPath, 'styles')));

/* ==============================
   🚀 FALLBACK PARA SPA (Express 5 compatible)
============================== */
app.use((req, res) => {
  // Este bloque se ejecuta para cualquier ruta no manejada previamente
  const indexPath = path.join(rootPath, 'index.html');
  res.sendFile(indexPath);
});


/* ==============================
   🚀 INICIAR SERVIDOR
============================== */
// ✅ Cambiado para soportar Docker y variables de entorno
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`\n✅ Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`📂 Root: ${path.join(__dirname, '..')}`);
  console.log(`🐳 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
});