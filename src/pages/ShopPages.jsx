import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/products.js';
import { cartTotal, salePrice } from '../utils/storage.js';

export function HomePage({ products, onAdd }) {
  return <>
    <section className="hero py-5"><div className="container py-5"><div className="row align-items-center gy-3">
      <div className="col-md-8 col-lg-7"><span className="eyebrow">DEL CAMPO A TU HOGAR</span><h1 className="display-4 fw-bold mt-3">Lo natural sabe mejor.</h1><p className="lead">Frutas, verduras y productos orgánicos seleccionados para tu familia.</p><Link className="btn btn-success btn-lg mt-2" to="/productos">Explorar productos →</Link></div>
      <div className="col-md-4 col-lg-5 text-center"><span className="hero-mark" aria-hidden="true">🥬</span></div>
    </div></div></section>
    <section className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><h2>Productos destacados</h2><Link to="/productos">Ver catálogo →</Link></div><div className="row g-4">{products.slice(0, 3).map(p => <div className="col-sm-6 col-lg-4" key={p.id}><ProductCard product={p} onAdd={onAdd} /></div>)}</div></section>
    <section className="soft-block py-4"><div className="container text-center"><h2 className="h4">🌱 Productos conscientes, compras simples</h2><p className="mb-0">Apoyamos una alimentación más fresca y responsable.</p></div></section>
  </>;
}

export function CatalogPage({ products, categories = [], onAdd }) {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('todas');
  const [query, setQuery] = useState('');
  const activeCategory = routeCategory || category;
  const filtered = products.filter(p => (activeCategory === 'todas' || p.category === activeCategory) && p.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="container py-5"><h1>Catálogo de productos</h1><p className="text-muted">Encuentra productos frescos y naturales.</p>
    <div className="row g-3 mb-4"><div className="col-md-7"><label htmlFor="search-products" className="form-label">Buscar productos</label><input id="search-products" className="form-control" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ejemplo: manzanas" /></div>
      <div className="col-md-5"><label htmlFor="product-category" className="form-label">Categoría</label><select id="product-category" className="form-select" value={activeCategory} onChange={e => { setCategory(e.target.value); if (routeCategory) navigate(e.target.value === 'todas' ? '/productos' : `/categorias/${e.target.value}`); }}><option value="todas">Todas</option>{(categories.length ? categories : [{ id:'frutas',name:'Frutas' },{ id:'verduras',name:'Verduras' },{ id:'despensa',name:'Despensa' }]).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div></div>
    <div className="row g-4">{filtered.map(p => <div className="col-sm-6 col-lg-4" key={p.id}><ProductCard product={p} onAdd={onAdd} /></div>)}</div>
    {!filtered.length && <p role="status">No hay productos para esa búsqueda.</p>}
  </div>;
}

export function CategoriesPage({ products, categories }) {
  return <div className="container py-5"><h1>Categorías</h1><p className="text-muted">Elige el tipo de producto que buscas.</p><div className="row g-4">{categories.map(c => <div key={c.id} className="col-sm-6 col-lg-4"><Link to={`/categorias/${c.id}`} className="card shadow-sm text-decoration-none h-100"><div className="card-body p-4"><h2 className="h4 text-success">{c.name}</h2><p className="text-muted mb-0">{products.filter(p => p.category === c.id).length} productos →</p></div></Link></div>)}</div></div>;
}

export function OffersPage({ products, onAdd }) {
  const offers = products.filter(p => Number(p.discount) > 0);
  return <div className="container py-5"><h1>Ofertas</h1><p>Productos con descuentos para ahorrar en tu compra.</p>
    <div className="row g-4">{offers.map(p => <div key={p.id} className="col-sm-6 col-lg-4"><ProductCard product={p} onAdd={onAdd} /></div>)}</div>
    {!offers.length && <p role="status">Actualmente no hay ofertas.</p>}
  </div>;
}

export function DetailPage({ products, onAdd }) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  if (!product) return <div className="container py-5"><h1>Producto no encontrado</h1><Link to="/productos">Volver al catálogo</Link></div>;
  return <div className="container py-5"><Link to="/productos">← Volver al catálogo</Link><div className="row g-5 align-items-center mt-1"><div className="col-md-6"><img className="img-fluid rounded-4 detail-image" src={product.image} alt={product.name} /></div><div className="col-md-6"><small className="text-capitalize text-success">{product.category}</small><h1>{product.name}</h1><p className="lead">{product.description}</p>{product.discount > 0 && <p><span className="badge text-bg-danger">-{product.discount}%</span> <del>{formatPrice(product.price)}</del></p>}<p className="display-6 text-success">{formatPrice(salePrice(product))}</p><button className="btn btn-success btn-lg" onClick={() => onAdd(product)}>Agregar al carrito</button></div></div></div>;
}

export function CartPage({ cart, onChange, onRemove, onClear }) {
  return <div className="container py-5"><h1>Tu carrito</h1>{cart.length === 0 ? <div className="py-5"><p>Tu carrito está vacío.</p><Link className="btn btn-success" to="/productos">Ver productos</Link></div> : <>
    <div className="table-responsive"><table className="table align-middle"><thead><tr><th scope="col">Producto</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Subtotal</th><th scope="col">Acción</th></tr></thead><tbody>{cart.map(item => <tr key={item.id}><td>{item.name}</td><td>{formatPrice(item.price)}</td><td><div className="d-flex align-items-center gap-2"><button className="btn btn-outline-secondary btn-sm" aria-label={`Reducir ${item.name}`} onClick={() => onChange(item.id, -1)}>−</button><span>{item.quantity}</span><button className="btn btn-outline-secondary btn-sm" aria-label={`Aumentar ${item.name}`} onClick={() => onChange(item.id, 1)}>+</button></div></td><td>{formatPrice(item.price * item.quantity)}</td><td><button className="btn btn-link text-danger" onClick={() => onRemove(item.id)}>Eliminar</button></td></tr>)}</tbody></table></div>
    <div className="text-end"><h2 className="h4">Total: {formatPrice(cartTotal(cart))}</h2><button className="btn btn-outline-danger me-2" onClick={onClear}>Vaciar carrito</button><Link className="btn btn-success" to="/checkout">Continuar compra →</Link><p className="text-muted mt-3 small">Checkout y pago simulados. No se cobran tarjetas.</p></div></>}
  </div>;
}
