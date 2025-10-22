import express from 'express';
import cors from 'cors';
import { addFavorite, removeFavorite, getFavorites } from './favoritesModel.js';

const app = express();
app.use(cors());
app.use(express.json());

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
