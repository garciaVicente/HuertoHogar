import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { registerUser } from '../utils/auth.js';
import { KEYS, loadCollection, saveCollection, createRecord, updateRecord, deleteRecord, slug } from '../data/database.js';

const emptyProduct = { name: '', category: 'frutas', price: '', stock: 10, image: '', description: '', discount: 0 };

export default function AdminPage({ products, categories, orders, onSaveProducts, onSaveCategories, onEditOrder }) {
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [users, setUsers] = useState(() => loadCollection(KEYS.users));
  const [userName, setUserName] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [openOrder, setOpenOrder] = useState(null);
  const paid = orders.filter(o => o.status === 'pagado');
  const revenue = paid.reduce((sum, o) => sum + o.total, 0);
  const nav = [['dashboard','Dashboard'], ['orders','Órdenes'], ['products','Productos'], ['categories','Categorías'], ['users','Usuarios'], ['reports','Reportes'], ['profile','Perfil']];

  function saveProduct(event) {
    event.preventDefault();
    if (!form.name.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) <= 0 || Number(form.discount) < 0 || Number(form.discount) > 90) {
      setFeedback('Completa nombre, precio positivo y descuento de 0 a 90.'); return;
    }
    const record = { ...form, name: form.name.trim(), price: Number(form.price), discount: Number(form.discount) || 0, stock: Math.max(0, Math.floor(Number(form.stock) || 0)), image: form.image.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', description: form.description.trim() };
    onSaveProducts(editId === null ? createRecord(products, record) : updateRecord(products, editId, record));
    setForm(emptyProduct); setEditId(null); setFeedback('Producto guardado.');
  }
  function saveCategory(event) {
    event.preventDefault();
    if (categoryName.trim().length < 2) { setFeedback('Escribe el nombre de la categoría.'); return; }
    const id = slug(categoryName);
    if (editCategory) {
      onSaveCategories(updateRecord(categories, editCategory, { name: categoryName.trim() }));
    } else if (!id || categories.some(c => c.id === id)) { setFeedback('La categoría ya existe.'); return; }
    else onSaveCategories(createRecord(categories, { id, name: categoryName.trim() }));
    setCategoryName(''); setEditCategory(null); setFeedback('Categoría guardada.');
  }
  function removeCategory(id) {
    if (products.some(p => p.category === id)) { setFeedback('Primero mueve o elimina los productos de esa categoría.'); return; }
    onSaveCategories(deleteRecord(categories, id)); setFeedback('Categoría eliminada.');
  }
  function saveUser(event) {
    event.preventDefault();
    if (!editUser || userName.trim().length < 3) { setFeedback('Selecciona un usuario y escribe un nombre válido.'); return; }
    const updated = updateRecord(users, editUser, { name: userName.trim() });
    saveCollection(KEYS.users, updated); setUsers(updated); setEditUser(null); setUserName(''); setFeedback('Usuario editado.');
  }
  async function addUser(event) {
    event.preventDefault();
    if (newUser.name.trim().length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email) || newUser.password.length < 6) {
      setFeedback('Ingresa un nombre, correo válido y contraseña de al menos 6 caracteres.'); return;
    }
    try {
      const result = await registerUser(newUser.name, newUser.email, newUser.password);
      if (!result.ok) { setFeedback(result.message); return; }
      setUsers(loadCollection(KEYS.users)); setNewUser({ name:'', email:'', password:'' }); setFeedback('Usuario de demostración creado.');
    } catch { setFeedback('No se pudo guardar el usuario.'); }
  }
  function removeUser(id) {
    const updated = deleteRecord(users, id); saveCollection(KEYS.users, updated); setUsers(updated); setFeedback('Usuario eliminado.');
  }
  return <div className="container-fluid container-xl py-5"><h1>Administración de HuertoHogar</h1>
    <div className="alert alert-warning">Panel de demostración académica: sin permisos reales. Los datos de usuarios son locales; no utilices datos sensibles ni contraseñas reales.</div>
    <div className="row g-4"><aside className="col-lg-3"><nav aria-label="Menú de administración" className="list-group">{nav.map(([id,name]) => <button type="button" key={id} className={`list-group-item list-group-item-action ${tab === id ? 'active' : ''}`} onClick={() => { setTab(id); setFeedback(''); }}>{name}</button>)}<Link to="/" className="list-group-item list-group-item-action">← Volver a tienda</Link></nav></aside>
      <section className="col-lg-9"><div role="status" className="text-success mb-2">{feedback}</div>
        {tab === 'dashboard' && <><h2 className="h4">Dashboard</h2><div className="row g-3 mb-4">{[['Pedidos',orders.length],['Productos',products.length],['Usuarios',users.length],['Categorías',categories.length]].map(([label,value]) => <div key={label} className="col-6 col-xl-3"><div className="card p-3 h-100"><small>{label}</small><strong className="fs-2 text-success">{value}</strong></div></div>)}</div><h3 className="h5">Total pagado en simulaciones: {formatPrice(revenue)}</h3><p>Usa el menú para gestionar compras, productos, categorías, usuarios y reportes.</p></>}
        {tab === 'products' && <><h2 className="h4">Productos · CRUD</h2><div className="table-responsive"><table className="table"><thead><tr><th>Nombre</th><th>Precio</th><th>Oferta</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td><td>{formatPrice(p.price)}</td><td>{p.discount || 0}%</td><td>{p.stock ?? 10}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditId(p.id); setForm({ name:p.name, category:p.category, price:p.price, stock:p.stock ?? 10, image:p.image, description:p.description, discount:p.discount || 0 }); }}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => onSaveProducts(deleteRecord(products, p.id))}>Eliminar</button></td></tr>)}</tbody></table></div>
          <h3 className="h5 mt-4">{editId === null ? 'Nuevo producto' : 'Editar producto'}</h3><form onSubmit={saveProduct} className="form-panel"><label className="form-label" htmlFor="p-name">Nombre</label><input id="p-name" className="form-control mb-2" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
            <label className="form-label" htmlFor="p-price">Precio ($CLP)</label><input id="p-price" type="number" min="1" className="form-control mb-2" value={form.price} onChange={e => setForm({...form,price:e.target.value})} />
            <label className="form-label" htmlFor="p-cat">Categoría</label><select id="p-cat" className="form-select mb-2" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select>
            <label className="form-label" htmlFor="p-stock">Stock disponible</label><input id="p-stock" type="number" min="0" className="form-control mb-2" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} />
            <label className="form-label" htmlFor="p-discount">Descuento (%)</label><input id="p-discount" type="number" min="0" max="90" className="form-control mb-2" value={form.discount} onChange={e => setForm({...form,discount:e.target.value})} />
            <label className="form-label" htmlFor="p-image">URL imagen (opcional)</label><input id="p-image" className="form-control mb-2" value={form.image} onChange={e => setForm({...form,image:e.target.value})} />
            <label className="form-label" htmlFor="p-desc">Descripción</label><textarea id="p-desc" className="form-control mb-3" rows="2" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/>
            <button className="btn btn-success">Guardar producto</button>{editId !== null && <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => {setEditId(null);setForm(emptyProduct);}}>Cancelar</button>}
          </form><h3 className="h5 mt-4">Productos críticos (stock 5 o menos)</h3><ul>{products.filter(p => (p.stock ?? 10) <= 5).map(p => <li key={p.id}>{p.name} — {p.stock ?? 0} unidades</li>)}</ul></>}
        {tab === 'categories' && <><h2 className="h4">Categorías · CRUD</h2><ul className="list-group mb-3">{categories.map(c => <li className="list-group-item d-flex justify-content-between align-items-center gap-2" key={c.id}><span>{c.name} ({products.filter(p => p.category === c.id).length} productos)</span><div><button className="btn btn-sm btn-outline-primary me-2" onClick={() => {setEditCategory(c.id);setCategoryName(c.name);}}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeCategory(c.id)}>Eliminar</button></div></li>)}</ul><form onSubmit={saveCategory} className="d-flex flex-wrap gap-2"><label className="visually-hidden" htmlFor="new-cat">Nombre categoría</label><input className="form-control w-auto" id="new-cat" placeholder="Nombre categoría" value={categoryName} onChange={e => setCategoryName(e.target.value)} /><button className="btn btn-success">{editCategory ? 'Actualizar categoría' : 'Agregar categoría'}</button></form></>}
        {tab === 'orders' && <><h2 className="h4">Órdenes y boletas de demostración</h2>{orders.length ? <div className="table-responsive"><table className="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{orders.map(o => <React.Fragment key={o.id}><tr><td>{o.number}</td><td>{o.customer.email}</td><td>{formatPrice(o.total)}</td><td><select aria-label={`Estado ${o.number}`} className="form-select form-select-sm" value={o.status} onChange={e => onEditOrder(o.id, { status: e.target.value })}><option value="pagado">Pagado</option><option value="rechazado">Rechazado</option><option value="preparando">Preparando</option><option value="entregado">Entregado</option></select></td><td><button className="btn btn-outline-primary btn-sm" onClick={() => setOpenOrder(openOrder === o.id ? null : o.id)}>Ver detalle</button></td></tr>{openOrder === o.id && <tr><td colSpan="5"><strong>Detalle de {o.number}</strong> <Link className="btn btn-outline-secondary btn-sm ms-2" to={`/compra/${o.status === 'rechazado' ? 'error' : 'exito'}/${o.id}`}>Ver boleta simulada</Link><ul>{o.items.map(p => <li key={p.id}>{p.name} × {p.quantity}: {formatPrice(p.price * p.quantity)}</li>)}</ul><p>{o.customer.name} {o.customer.lastName} — {o.customer.street}, {o.customer.city}</p></td></tr>}</React.Fragment>)}</tbody></table></div> : <p>Sin órdenes registradas. Finaliza una compra de demostración.</p>}</>}
        {tab === 'users' && <><h2 className="h4">Usuarios registrados</h2>{users.length ? <ul className="list-group mb-3">{users.map(u => <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2" key={u.id}><span>{u.name} — {u.email}</span><span><button className="btn btn-outline-primary btn-sm me-2" onClick={() => {setEditUser(u.id);setUserName(u.name);}}>Editar</button><button className="btn btn-outline-danger btn-sm" onClick={() => removeUser(u.id)}>Eliminar</button></span></li>)}</ul> : <p>Aún no existen usuarios.</p>}<h3 className="h5 mt-4">Nuevo usuario de demostración</h3><form className="row g-2" onSubmit={addUser}><div className="col-md-4"><label className="visually-hidden" htmlFor="admin-user-name">Nombre nuevo usuario</label><input id="admin-user-name" className="form-control" placeholder="Nombre" value={newUser.name} onChange={e => setNewUser({...newUser,name:e.target.value})}/></div><div className="col-md-4"><label className="visually-hidden" htmlFor="admin-user-email">Correo nuevo usuario</label><input id="admin-user-email" className="form-control" placeholder="Correo" type="email" value={newUser.email} onChange={e => setNewUser({...newUser,email:e.target.value})}/></div><div className="col-md-4"><label className="visually-hidden" htmlFor="admin-user-password">Contraseña nuevo usuario</label><input id="admin-user-password" className="form-control" placeholder="Contraseña demo" type="password" value={newUser.password} onChange={e => setNewUser({...newUser,password:e.target.value})}/></div><div className="col-12"><button className="btn btn-success">Crear usuario</button></div></form>{editUser !== null && <form className="d-flex gap-2 mt-3" onSubmit={saveUser}><label htmlFor="edit-user" className="visually-hidden">Nuevo nombre</label><input id="edit-user" className="form-control" value={userName} onChange={e => setUserName(e.target.value)}/><button className="btn btn-success">Guardar usuario</button></form>}<p className="small text-muted mt-3">Cuentas solo para demostrar interfaz; las credenciales se guardan en el navegador, no hay roles de servidor.</p></>}
        {tab === 'reports' && <><h2 className="h4">Reportes de venta</h2><p>Órdenes totales: <strong>{orders.length}</strong> · Pagadas: <strong>{paid.length}</strong> · Rechazadas: <strong>{orders.filter(o => o.status === 'rechazado').length}</strong></p><p>Ventas pagadas simuladas: <strong>{formatPrice(revenue)}</strong></p><p>Productos críticos: <strong>{products.filter(p => (p.stock ?? 10) <= 5).length}</strong></p><h3 className="h5">Productos vendidos</h3><ul>{products.map(p => { const qty = paid.flatMap(o => o.items).filter(x => x.id === p.id).reduce((n,item) => n + item.quantity,0); return <li key={p.id}>{p.name}: {qty} unidades</li>; })}</ul></>}
        {tab === 'profile' && <><h2 className="h4">Perfil del administrador</h2><p>Perfil académico de demostración. Este panel no implementa roles ni contraseñas de administrador.</p><p>Proyecto: HuertoHogar · Evaluación Parcial 2</p></>}
      </section></div>
  </div>;
}
