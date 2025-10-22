import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDB() {
  const db = await open({
    filename: './backend/db/favorites.db',
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
}

export async function removeFavorite(id) {
  const db = await initDB();
  await db.run('DELETE FROM favorites WHERE id = ?', [id]);
}

export async function getFavorites() {
  const db = await initDB();
  return await db.all('SELECT * FROM favorites');
}
