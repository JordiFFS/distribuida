import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { addFavorite, removeFavorite, getFavorites } from './favoritesModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/styles', express.static(path.join(__dirname, '../../styles')));

// Rutas de la API
app.get('/api/favorites', async (req, res) => {
  const favs = await getFavorites();
  res.json(favs);
});

app.post('/api/favorites', async (req, res) => {
  await addFavorite(req.body);
  res.json({ message: 'Favorito agregado' });
});

app.delete('/api/favorites/:id', async (req, res) => {
  await removeFavorite(req.params.id);
  res.json({ message: 'Favorito eliminado' });
});

app.listen(4000, () => console.log('✅ Backend corriendo en http://localhost:4000'));