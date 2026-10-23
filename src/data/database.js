// Base de datos simulada en JavaScript. Se persiste en localStorage para esta evaluación.
export const initialCategories = [
  { id: 'frutas', name: 'Frutas' },
  { id: 'verduras', name: 'Verduras' },
  { id: 'despensa', name: 'Despensa' }
];

export const KEYS = {
  products: 'huerto_products_v2', categories: 'huerto_categories_v2',
  orders: 'huerto_orders_v2', users: 'huerto_users'
};

export function loadCollection(key, defaults = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : defaults.map(item => ({ ...item }));
  } catch { return defaults.map(item => ({ ...item })); }
}

export function saveCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export function createRecord(records, record) {
  const id = record.id ?? Math.max(0, ...records.map(item => Number(item.id) || 0)) + 1;
  if (records.some(item => String(item.id) === String(id))) throw new Error('ID repetido');
  return [...records, { ...record, id }];
}

export function updateRecord(records, id, fields) {
  return records.map(item => String(item.id) === String(id) ? { ...item, ...fields, id: item.id } : item);
}

export function deleteRecord(records, id) {
  return records.filter(item => String(item.id) !== String(id));
}

export function slug(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function createOrder(cart, customer, approved = true) {
  return {
    id: Date.now(), number: `HH-${Date.now()}`, createdAt: new Date().toISOString(),
    status: approved ? 'pagado' : 'rechazado', customer: { ...customer },
    items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
    total: cart.reduce((total, item) => total + item.price * item.quantity, 0)
  };
}
