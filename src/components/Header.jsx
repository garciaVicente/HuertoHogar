import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ count, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['/', 'Inicio'], ['/productos', 'Productos'], ['/categorias', 'Categorías'],
    ['/ofertas', 'Ofertas'], ['/blogs', 'Blog'], ['/nosotros', 'Nosotros'], ['/contacto', 'Contacto']
  ];
  return <header className="site-header sticky-top shadow-sm"><nav className="navbar navbar-expand-lg container py-3" aria-label="Navegación principal">
    <Link to="/" className="navbar-brand fw-bold">🌱 HuertoHogar</Link>
    <button type="button" className="navbar-toggler" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}><span className="navbar-toggler-icon" /></button>
    <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}><div className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
      {links.map(([url, title]) => <NavLink to={url} className="nav-link" key={url} onClick={() => setOpen(false)}>{title}</NavLink>)}
      <NavLink className="nav-link" to="/carrito" onClick={() => setOpen(false)}>🛒 Carrito <span className="badge text-bg-success">{count}</span></NavLink>
      {user ? <><Link to="/perfil" className="nav-link" onClick={() => setOpen(false)}>Mi perfil</Link><button className="btn btn-outline-success btn-sm" onClick={onLogout}>Salir</button></> : <Link className="btn btn-outline-success btn-sm" to="/login">Ingresar</Link>}
      <Link to="/admin" className="nav-link">Admin</Link>
    </div></div>
  </nav></header>;
}
