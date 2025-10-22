// Archivo: api/api.js

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return null;
  }
}
