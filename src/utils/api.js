// Integración opcional: iniciar `npm run server` para almacenar productos y pedidos en JSON.
// Si no hay backend, React sigue funcionando con su persistencia local de demostración.
export async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`/api${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch { return null; }
}
