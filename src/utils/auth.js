import { readJson } from './storage.js';

const usersKey = 'huerto_users'; // Compatibilidad con el proyecto original.

// DEMOSTRACIÓN ACADÉMICA: la autenticación real necesita servidor y base de datos.
async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(salt + ':' + password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(name, email, password) {
  const users = readJson(usersKey, []);
  const normalized = email.trim().toLowerCase();
  if (users.some(u => u.email === normalized)) return { ok: false, message: 'Ya existe un usuario con ese correo.' };
  const salt = crypto.randomUUID();
  const user = { id: Date.now(), name: name.trim(), email: normalized, salt, passwordHash: await hashPassword(password, salt) };
  localStorage.setItem(usersKey, JSON.stringify([...users, user]));
  return { ok: true, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(email, password) {
  const users = readJson(usersKey, []);
  const normalized = email.trim().toLowerCase();
  const user = users.find(u => u.email === normalized);
  if (!user) return { ok: false, message: 'No existe una cuenta con ese correo.' };
  // Admite cuentas antiguas y migra su contraseña almacenada en texto al iniciar sesión.
  if (user.passwordHash) {
    if ((await hashPassword(password, user.salt)) !== user.passwordHash) return { ok: false, message: 'Contraseña incorrecta.' };
  } else {
    if (user.password !== password) return { ok: false, message: 'Contraseña incorrecta.' };
    user.salt = crypto.randomUUID();
    user.passwordHash = await hashPassword(password, user.salt);
    delete user.password;
    localStorage.setItem(usersKey, JSON.stringify(users));
  }
  return { ok: true, user: { id: user.id, name: user.name, email: user.email } };
}
