import { loadEnv } from './src/api/api.js';
import { initRouter } from './src/routes/router.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadEnv();
  initRouter();
});
