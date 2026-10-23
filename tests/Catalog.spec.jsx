import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CatalogPage } from '../src/pages/ShopPages.jsx';
import { initialProducts } from '../src/data/products.js';

afterEach(cleanup);

describe('CatalogPage', () => {
  function openCatalog() { render(<MemoryRouter><CatalogPage products={initialProducts} onAdd={() => {}} /></MemoryRouter>); }

  it('03 - muestra seis productos al seleccionar Todas', () => {
    openCatalog();
    expect(screen.getAllByRole('button', { name: 'Agregar al carrito' }).length).toBe(6);
  });

  it('04 - filtra las tarjetas por categoría usando estado React', () => {
    openCatalog();
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'frutas' } });
    expect(screen.getAllByRole('button', { name: 'Agregar al carrito' }).length).toBe(2);
    expect(screen.queryByRole('heading', { name: 'Tomates Limachinos' })).toBeNull();
  });

  it('05 - busca productos por texto y muestra mensaje si no encuentra', () => {
    openCatalog();
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'nada-que-exista' } });
    expect(screen.getByRole('status').textContent).toContain('No hay productos');
  });
});
