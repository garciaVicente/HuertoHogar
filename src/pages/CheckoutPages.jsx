import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cartTotal, readJson } from '../utils/storage.js';
import { formatPrice } from '../data/products.js';
import { createOrder } from '../data/database.js';
import { validateCheckout } from '../utils/validation.js';

export function CheckoutPage({ cart, user, onComplete }) {
  const navigate = useNavigate();
  const names = user?.name?.trim().split(/\s+/) ?? [];
  const [form, setForm] = useState(() => ({ street:'',apartment:'',region:'',city:'',indications:'',delivery:'domicilio',
    ...(user ? readJson(`huerto_delivery_${user.id ?? user.email}`, {}) : {}),
    name: names[0] || '', lastName: names.slice(1).join(' '), email: user?.email || '' }));
  const [approved, setApproved] = useState(true);
  const [errors, setErrors] = useState({});
  function submit(event) {
    event.preventDefault();
    const next = validateCheckout(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    if (user) localStorage.setItem(`huerto_delivery_${user.id ?? user.email}`, JSON.stringify({ street:form.street, apartment:form.apartment, region:form.region, city:form.city, indications:form.indications, delivery:form.delivery }));
    const order = createOrder(cart, form, approved);
    onComplete(order);
    navigate(`/compra/${approved ? 'exito' : 'error'}/${order.id}`);
  }
  if (!cart.length) return <div className="container py-5"><h1>Finalizar compra</h1><p>Agrega productos antes de continuar.</p><Link to="/productos">Ir al catálogo</Link></div>;
  const field = (key, title, required = true) => <div className="col-md-6" key={key}><label className="form-label" htmlFor={`check-${key}`}>{title}{required ? ' *' : ''}</label><input id={`check-${key}`} className={`form-control ${errors[key] ? 'is-invalid' : ''}`} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /><div className="invalid-feedback" role="alert">{errors[key]}</div></div>;
  return <div className="container py-5"><h1>Checkout · datos de entrega</h1><p className="text-muted">Paso de compra de demostración. Los datos son locales; no se efectúa un cobro real.</p>
    <div className="row g-4"><div className="col-lg-7"><form className="form-panel" onSubmit={submit} noValidate>
      <h2 className="h5 mb-3">Información del cliente</h2><div className="row g-3">{field('name', 'Nombre')}{field('lastName','Apellidos')}{field('email','Correo electrónico')}</div>
      <h2 className="h5 mt-4 mb-3">Dirección de entrega</h2><div className="row g-3">{field('street','Calle y número')}{field('apartment','Departamento (opcional)',false)}
        <div className="col-md-6"><label className="form-label" htmlFor="check-region">Región *</label><select id="check-region" className={`form-select ${errors.region ? 'is-invalid' : ''}`} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}><option value="">Selecciona una región</option><option>Región Metropolitana</option><option>Valparaíso</option><option>O'Higgins</option><option>Maule</option><option>Biobío</option><option>Otra región</option></select><div className="invalid-feedback" role="alert">{errors.region}</div></div>
        {field('city','Comuna')}
        <div className="col-12"><label className="form-label" htmlFor="check-indications">Indicaciones (opcional)</label><textarea id="check-indications" className="form-control" rows="2" value={form.indications} onChange={e => setForm({ ...form, indications: e.target.value })} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="check-delivery">Entrega</label><select id="check-delivery" className="form-select" value={form.delivery} onChange={e => setForm({ ...form, delivery: e.target.value })}><option value="domicilio">Despacho a domicilio</option><option value="retiro">Retiro en tienda</option></select></div>
        <div className="col-md-6"><label className="form-label" htmlFor="check-payment">Resultado de pago simulado</label><select id="check-payment" className="form-select" value={approved ? 'ok' : 'error'} onChange={e => setApproved(e.target.value === 'ok')}><option value="ok">Pago aprobado (simulación)</option><option value="error">Pago rechazado (simulación)</option></select></div>
      </div><button type="submit" className="btn btn-success mt-4">Confirmar compra de {formatPrice(cartTotal(cart))}</button>
    </form></div><div className="col-lg-5"><div className="card p-4"><h2 className="h5">Resumen</h2>{cart.map(item => <div key={item.id} className="d-flex justify-content-between border-bottom py-2"><span>{item.name} × {item.quantity}</span><span>{formatPrice(item.quantity * item.price)}</span></div>)}<strong className="text-success fs-4 mt-3">Total: {formatPrice(cartTotal(cart))}</strong></div></div></div>
  </div>;
}

export function OrderResultPage({ orders, approved }) {
  const { id } = useParams();
  const order = orders.find(o => String(o.id) === id);
  if (!order) return <div className="container py-5"><h1>Pedido no encontrado</h1><Link to="/productos">Ver catálogo</Link></div>;
  const success = approved && order.status !== 'rechazado';
  return <div className="container py-5"><div className="form-panel mx-auto" style={{ maxWidth: 780 }}>
    <h1 className={success ? 'h3 text-success' : 'h3 text-danger'}>{success ? '✓ Compra realizada (simulación)' : '✕ No se pudo realizar el pago'}</h1>
    <p>Número de pedido: <strong>{order.number}</strong></p><p>Estado: <strong>{order.status}</strong></p>
    <h2 className="h5">Cliente y entrega</h2><p>{order.customer.name} {order.customer.lastName} · {order.customer.email}</p><p>{order.customer.street}{order.customer.apartment && `, Depto. ${order.customer.apartment}`}, {order.customer.city}, {order.customer.region}</p>
    <h2 className="h5 mt-4">Productos</h2><div className="table-responsive"><table className="table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>{order.items.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>{formatPrice(item.price * item.quantity)}</td></tr>)}</tbody></table></div>
    <p className="h4 text-success">Total: {formatPrice(order.total)}</p>
    <div className="d-flex gap-2 flex-wrap">{success ? <Link className="btn btn-success" to="/productos">Seguir comprando</Link> : <Link className="btn btn-success" to="/checkout">Volver a intentar el pago</Link>}<button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>Imprimir resumen</button></div>
    <p className="small text-muted mt-3">Documento de muestra. No equivale a boleta o comprobante tributario.</p>
  </div></div>;
}
