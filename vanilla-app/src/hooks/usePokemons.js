import { getPokemonDetails, getPokemons } from "../api/api";

export async function usePokemons(limit = 20, offset = 0) {
    const pokemons = await getPokemons(limit, offset);
    const details = await Promise.all(pokemons.map(p => getPokemonDetails(p.url)));
    return details;
}
