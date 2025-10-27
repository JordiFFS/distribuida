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
app.use(express.static(path.join(__dirname, '..')));

/* ==============================
   🚀 FALLBACK PARA SPA (Express 5 compatible)
============================== */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

/* ==============================
   🚀 INICIAR SERVIDOR
============================== */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📂 Root: ${path.join(__dirname, '..')}\n`);
});