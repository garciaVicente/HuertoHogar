import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { loadCollection, KEYS, updateRecord, saveCollection } from '../data/database.js';

export function ProfilePage({ user, orders, onAuth }) {
  const [name, setName] = useState(user?.name || '');
  const [feedback, setFeedback] = useState('');
  if (!user) return <div className="container py-5"><h1>Mi perfil</h1><p>Para consultar tu perfil, inicia sesión.</p><Link to="/login">Ingresar</Link></div>;
  const myOrders = orders.filter(o => o.customer?.email?.toLowerCase() === user.email.toLowerCase());
  function save(event) {
    event.preventDefault();
    if (name.trim().length < 3) { setFeedback('El nombre requiere 3 caracteres.'); return; }
    const users = loadCollection(KEYS.users);
    saveCollection(KEYS.users, updateRecord(users, user.id, { name: name.trim() }));
    onAuth({ ...user, name: name.trim() });
    setFeedback('Perfil guardado en este navegador.');
  }
  return <div className="container py-5"><h1>Mi perfil</h1><form onSubmit={save} className="form-panel mb-4"><label className="form-label" htmlFor="profile-name">Nombre</label><input className="form-control mb-3" id="profile-name" value={name} onChange={e => setName(e.target.value)} /><p>Correo: {user.email}</p><button className="btn btn-success">Guardar nombre</button><p role="status" className="mt-2">{feedback}</p></form>
    <h2 className="h4">Mi historial de compras simuladas</h2>{myOrders.length ? <ul className="list-group">{myOrders.map(o => <li className="list-group-item" key={o.id}>{o.number} · {o.status} · {formatPrice(o.total)}</li>)}</ul> : <p>Sin pedidos registrados.</p>}
  </div>;
}
