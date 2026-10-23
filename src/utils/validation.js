export const validName = name =>
  /^[\p{L}]+(?: +[\p{L}]+)*$/u.test(String(name || '').trim());

export const validEmail = email =>
  /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(String(email || '').trim());


export function validateContact({ name, email, message }) {
  const errors = {};

  if (name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.';
  } else if (!validName(name)) {
    errors.name = 'El nombre solo puede contener letras y espacios.';
  }

  if (!validEmail(email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  }

  return errors;
}

export function validateRegistration({ name, email, password, confirm }) {
  const errors = {};

  if (name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.';
  } else if (!validName(name)) {
    errors.name = 'El nombre solo puede contener letras y espacios.';
  }

  if (!validEmail(email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.';
  }

  if (confirm !== password) {
    errors.confirm = 'Las contraseñas no coinciden.';
  }

  return errors;
}
export function validateCheckout(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Ingresa tu nombre.';
  if (!data.lastName.trim()) errors.lastName = 'Ingresa tus apellidos.';
  if (!validEmail(data.email)) errors.email = 'Ingresa un correo válido.';
  if (!data.street.trim()) errors.street = 'Ingresa tu dirección.';
  if (!data.region.trim()) errors.region = 'Selecciona una región.';
  if (!data.city.trim()) errors.city = 'Ingresa tu comuna.';
  if (!['domicilio', 'retiro'].includes(data.delivery)) errors.delivery = 'Selecciona entrega.';
  return errors;
}
