import { deleteFavorite, getFavoritesFromServer, saveFavorite } from "../api/api";

export const useFavorites = {
  add: async (pokemon) => await saveFavorite(pokemon),
  remove: async (id) => await deleteFavorite(id),
  getAll: async () => await getFavoritesFromServer()
};
