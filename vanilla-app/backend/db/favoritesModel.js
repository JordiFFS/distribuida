import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta a la base de datos
const DB_PATH = path.join(__dirname, 'favorites.db');

export async function initDB() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY,
      name TEXT,
      image TEXT
    )
  `);

  return db;
}

export async function addFavorite(pokemon) {
  const db = await initDB();
  await db.run('INSERT OR IGNORE INTO favorites (id, name, image) VALUES (?, ?, ?)',
    [pokemon.id, pokemon.name, pokemon.image]);
  await db.close();
}

export async function removeFavorite(id) {
  const db = await initDB();
  await db.run('DELETE FROM favorites WHERE id = ?', [id]);
  await db.close();
}

export async function getFavorites() {
  const db = await initDB();
  const favorites = await db.all('SELECT * FROM favorites');
  await db.close();
  return favorites;
}