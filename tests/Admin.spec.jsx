import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AdminPage from '../src/pages/AdminPage.jsx';
import { initialProducts } from '../src/data/products.js';
import { initialCategories } from '../src/data/database.js';

afterEach(cleanup);
describe('Administrador de demostración', () => {
  it('27 - navega a productos y ejecuta CRUD con callback mock', () => {
    const onSaveProducts = jasmine.createSpy('onSaveProducts');
    render(<MemoryRouter><AdminPage products={initialProducts} categories={initialCategories} orders={[]} onSaveProducts={onSaveProducts} onSaveCategories={() => {}} onEditOrder={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Productos' }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Pera orgánica' } });
    fireEvent.change(screen.getByLabelText('Precio ($CLP)'), { target: { value: '1500' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(onSaveProducts).toHaveBeenCalled();
    const next = onSaveProducts.calls.mostRecent().args[0];
    expect(next.some(p => p.name === 'Pera orgánica')).toBeTrue();
  });
  it('28 - muestra dashboard con número de productos', () => {
    render(<MemoryRouter><AdminPage products={initialProducts} categories={initialCategories} orders={[]} onSaveProducts={() => {}} onSaveCategories={() => {}} onEditOrder={() => {}} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
  });
});
