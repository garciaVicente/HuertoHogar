import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard.jsx';
import { initialProducts } from '../src/data/products.js';

afterEach(cleanup);
const product = initialProducts[0];

describe('ProductCard', () => {
  it('01 - muestra el nombre, precio y enlace de detalle (DOM y props)', () => {
    render(<MemoryRouter><ProductCard product={product} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: product.name })).toBeTruthy();
    expect(screen.getByText('$2.500')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: product.name })[0].getAttribute('href')).toBe('/productos/1');
  });

  it('02 - llama al callback recibido al agregar al carrito (mock)', () => {
    const onAdd = jasmine.createSpy('onAdd');
    render(<MemoryRouter><ProductCard product={product} onAdd={onAdd} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(onAdd).toHaveBeenCalledOnceWith(product);
  });
});
