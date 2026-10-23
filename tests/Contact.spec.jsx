import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ContactPage } from '../src/pages/FormsPages.jsx';

afterEach(cleanup);

describe('ContactPage', () => {
  it('10 - valida el formulario, manipula el DOM y evita envío inválido', () => {
    const onSend = jasmine.createSpy('onSend');
    render(<ContactPage onSend={onSend} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeTruthy();
    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy();
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy();
    expect(onSend).not.toHaveBeenCalled();
  });

  it('11 - acepta formulario válido y llama al mock onSend', () => {
    const onSend = jasmine.createSpy('onSend');
    render(<ContactPage onSend={onSend} />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'María Soto' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'maria@ejemplo.cl' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Necesito información de los productos.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(onSend).toHaveBeenCalledOnceWith({ name: 'María Soto', email: 'maria@ejemplo.cl', message: 'Necesito información de los productos.' });
    expect(screen.getByRole('status').textContent).toContain('Mensaje validado');
  });
});
