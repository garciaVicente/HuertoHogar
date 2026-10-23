import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateContact, validateRegistration, validEmail } from '../utils/validation.js';
import { registerUser, loginUser } from '../utils/auth.js';

export function ContactPage({ onSend = () => {} }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateContact(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) { onSend(form); setSent(true); setForm({ name: '', email: '', message: '' }); }
  }
  return <div className="container py-5"><h1>Contacto</h1><p>¿Necesitas ayuda? Escríbenos.</p>
    {sent && <div role="status" className="alert alert-success">Mensaje validado. Esta demostración no envía correos.</div>}
    <form noValidate onSubmit={handleSubmit} className="form-panel">{[
      ['name', 'Nombre', 'text'], ['email', 'Correo electrónico', 'email']
    ].map(([key, label, type]) => <div className="mb-3" key={key}><label className="form-label" htmlFor={key}>{label}</label><input className={`form-control ${errors[key] ? 'is-invalid' : ''}`} id={key} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /><div role="alert" className="invalid-feedback">{errors[key]}</div></div>)}
      <div className="mb-3"><label htmlFor="message" className="form-label">Mensaje</label><textarea id="message" className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /><div role="alert" className="invalid-feedback">{errors.message}</div></div>
      <button className="btn btn-success" type="submit">Enviar mensaje</button></form>
  </div>;
}

export function AuthPage({ mode, onAuth }) {
  const register = mode === 'registro';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = register ? validateRegistration(form) : {};
    if (!register) { if (!validEmail(form.email)) nextErrors.email = 'Ingresa un correo válido.'; if (!form.password) nextErrors.password = 'Ingresa tu contraseña.'; }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      const result = register ? await registerUser(form.name, form.email, form.password) : await loginUser(form.email, form.password);
      if (!result.ok) { setErrors({ email: result.message }); return; }
      onAuth(result.user);
      navigate('/');
    } catch { setErrors({ email: 'No se pudo guardar la cuenta. Comprueba el almacenamiento del navegador.' }); }
    finally { setBusy(false); }
  }
  return <div className="container py-5"><div className="form-panel mx-auto"><h1 className="h2">{register ? 'Crea tu cuenta' : 'Iniciar sesión'}</h1><p className="small text-muted">Acceso de demostración guardado en este navegador; no es autenticación de producción.</p>
    <form noValidate onSubmit={handleSubmit}>
      {(register ? [['name','Nombre','text'],['email','Correo electrónico','email'],['password','Contraseña','password'],['confirm','Confirmar contraseña','password']] : [['email','Correo electrónico','email'],['password','Contraseña','password']]).map(([key,label,type]) => <div className="mb-3" key={key}><label className="form-label" htmlFor={`auth-${key}`}>{label}</label><input className={`form-control ${errors[key] ? 'is-invalid' : ''}`} id={`auth-${key}`} type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} /><div className="invalid-feedback" role="alert">{errors[key]}</div></div>)}
      <button type="submit" disabled={busy} className="btn btn-success w-100">{busy ? 'Espera…' : register ? 'Registrarme' : 'Ingresar'}</button>
    </form><p className="mt-3 mb-0">{register ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'} <Link to={register ? '/login' : '/registro'}>{register ? 'Ingresar' : 'Regístrate'}</Link></p></div></div>;
}
