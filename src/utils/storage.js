import { initialProducts } from '../data/products.js';

export function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadProducts() {
  const saved = readJson('huerto_products_v2', null);
  return Array.isArray(saved) ? saved : initialProducts;
}

// La clave huerto_cart es la misma usada en el proyecto HTML original.
export function loadCart() {
  const saved = readJson('huerto_cart', []);
  if (!Array.isArray(saved)) return [];
  return saved.filter(p => p && Number.isFinite(Number(p.id)) && Number(p.quantity) > 0)
    .map(p => ({ ...p, id: Number(p.id), quantity: Math.floor(Number(p.quantity)) }));
}

export function salePrice(product) {
  const discount = Math.min(90, Math.max(0, Number(product.discount) || 0));
  return Math.round(Number(product.price) * (1 - discount / 100));
}

export function addItem(cart, product) {
  const saleProduct = { ...product, price: salePrice(product) };
  const found = cart.find(item => item.id === product.id);
  return found
    ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { ...saleProduct, quantity: 1 }];
}

export function changeQuantity(cart, id, amount) {
  return cart.map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
    .filter(item => item.quantity > 0);
}

export function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
