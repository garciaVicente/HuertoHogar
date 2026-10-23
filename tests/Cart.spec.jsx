import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CartPage } from '../src/pages/ShopPages.jsx';
import { initialProducts } from '../src/data/products.js';

afterEach(cleanup);
const item = { ...initialProducts[0], quantity: 2 };
function showCart(cart, onChange = () => {}, onRemove = () => {}) {
  return render(<MemoryRouter><CartPage cart={cart} onChange={onChange} onRemove={onRemove} onClear={() => {}} /></MemoryRouter>);
}

describe('CartPage', () => {
  it('06 - avisa si el carrito está vacío', () => {
    showCart([]);
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
  });

  it('07 - calcula subtotales y total según cantidad', () => {
    showCart([item]);
    expect(screen.getByText('Total: $5.000')).toBeTruthy();
    expect(screen.getByRole('cell', { name: '$5.000' })).toBeTruthy();
  });

  it('08 - aumenta la cantidad mediante callback con ID y cantidad', () => {
    const onChange = jasmine.createSpy('onChange');
    showCart([item], onChange);
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Manzanas Orgánicas' }));
    expect(onChange).toHaveBeenCalledOnceWith(1, 1);
  });

  it('09 - elimina un producto mediante callback', () => {
    const onRemove = jasmine.createSpy('onRemove');
    showCart([item], () => {}, onRemove);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onRemove).toHaveBeenCalledOnceWith(1);
  });
});
