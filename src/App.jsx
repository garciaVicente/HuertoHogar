import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import { HomePage, CatalogPage, DetailPage, CartPage, CategoriesPage, OffersPage } from './pages/ShopPages.jsx';
import { ContactPage, AuthPage } from './pages/FormsPages.jsx';
import { BlogPage, ArticlePage, AboutPage } from './pages/ContentPages.jsx';
import { CheckoutPage, OrderResultPage } from './pages/CheckoutPages.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { addItem, cartCount, changeQuantity, loadCart, readJson } from './utils/storage.js';
import { initialProducts } from './data/products.js';
import { initialCategories, KEYS, loadCollection, saveCollection, createRecord, updateRecord } from './data/database.js';
import { apiRequest } from './utils/api.js';

export default function App() {
  const [products, setProducts] = useState(() => loadCollection(KEYS.products, initialProducts));
  const [categories, setCategories] = useState(() => loadCollection(KEYS.categories, initialCategories));
  const [orders, setOrders] = useState(() => loadCollection(KEYS.orders));
  const [cart, setCart] = useState(loadCart);
  const [user, setUser] = useState(() => readJson('huerto_session', null));
  const [notice, setNotice] = useState('');
  useEffect(() => {
  if (!notice) return;

  const timer = setTimeout(() => {
    setNotice('');
  }, 1500);

  return () => clearTimeout(timer);
}, [notice]);



  useEffect(() => { saveCollection('huerto_cart', cart); }, [cart]);
  useEffect(() => { saveCollection(KEYS.products, products); }, [products]);
  useEffect(() => { saveCollection(KEYS.categories, categories); }, [categories]);
  useEffect(() => { saveCollection(KEYS.orders, orders); }, [orders]);
  useEffect(() => {
    let alive = true;
    apiRequest('/data').then(data => {
      if (alive && data && Array.isArray(data.products)) {
        setProducts(data.products); setCategories(data.categories); setOrders(data.orders);
      }
    });
    return () => { alive = false; };
  }, []);

  function saveProducts(next) { setProducts(next); void apiRequest('/products', { method: 'PUT', body: JSON.stringify(next) }); }
  function saveCategories(next) { setCategories(next); void apiRequest('/categories', { method: 'PUT', body: JSON.stringify(next) }); }
  function saveOrders(next) { setOrders(next); void apiRequest('/orders', { method: 'PUT', body: JSON.stringify(next) }); }
  function add(product) { setCart(old => addItem(old, product)); setNotice(`${product.name} agregado al carrito.`); }
  function signIn(next) { setUser(next); localStorage.setItem('huerto_session', JSON.stringify(next)); }
  function signOut() { setUser(null); localStorage.removeItem('huerto_session'); }
  function finishOrder(order) { saveOrders(createRecord(orders, order)); if (order.status === 'pagado') setCart([]); }
  function editOrder(id, fields) { saveOrders(updateRecord(orders, id, fields)); }
  return <div className="d-flex flex-column min-vh-100">
    <Header count={cartCount(cart)} user={user} onLogout={signOut} />
    {notice && (<div role="status" className="alert alert-success position-fixed top-50 start-50 translate-middle shadow-lg d-flex align-items-center gap-3"
    style={{ zIndex: 2000, maxWidth: '90vw' }}
  >
    <span>{notice}</span>

    <button
      type="button"
      className="btn-close"
      aria-label="Cerrar aviso"
      onClick={() => setNotice('')}
    />
  </div>
)}
    <main className="flex-grow-1"><Routes>
      <Route path="/" element={<HomePage products={products} onAdd={add} />} />
      <Route path="/productos" element={<CatalogPage products={products} categories={categories} onAdd={add} />} />
      <Route path="/productos/:id" element={<DetailPage products={products} onAdd={add} />} />
      <Route path="/categorias" element={<CategoriesPage products={products} categories={categories} />} />
      <Route path="/categorias/:category" element={<CatalogPage products={products} categories={categories} onAdd={add} />} />
      <Route path="/ofertas" element={<OffersPage products={products} onAdd={add} />} />
      <Route path="/carrito" element={<CartPage cart={cart} onChange={(id, amount) => setCart(old => changeQuantity(old, id, amount))} onRemove={id => setCart(old => old.filter(p => p.id !== id))} onClear={() => setCart([])} />} />
      <Route path="/checkout" element={<CheckoutPage cart={cart} user={user} onComplete={finishOrder} />} />
      <Route path="/compra/exito/:id" element={<OrderResultPage orders={orders} approved />} />
      <Route path="/compra/error/:id" element={<OrderResultPage orders={orders} approved={false} />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={signIn} />} />
      <Route path="/registro" element={<AuthPage mode="registro" onAuth={signIn} />} />
      <Route path="/perfil" element={<ProfilePage user={user} orders={orders} onAuth={signIn} />} />
      <Route path="/blogs" element={<BlogPage />} /><Route path="/blogs/:id" element={<ArticlePage />} />
      <Route path="/nosotros" element={<AboutPage />} />
      <Route path="/admin" element={<AdminPage products={products} categories={categories} orders={orders} onSaveProducts={saveProducts} onSaveCategories={saveCategories} onSaveOrders={saveOrders} onEditOrder={editOrder} />} />
      <Route path="*" element={<div className="container py-5"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></div>} />
    </Routes></main>
    <footer className="site-footer py-4"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span>© HuertoHogar · Productos orgánicos</span><span>Proyecto académico · Desarrollo Fullstack II</span></div></footer>
  </div>;
}
