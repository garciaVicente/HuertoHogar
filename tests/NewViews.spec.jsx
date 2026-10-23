import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CategoriesPage, OffersPage } from '../src/pages/ShopPages.jsx';
import { CheckoutPage, OrderResultPage } from '../src/pages/CheckoutPages.jsx';
import { initialProducts } from '../src/data/products.js';
import { initialCategories, createOrder } from '../src/data/database.js';

const testCart = [{ ...initialProducts[0], quantity: 1 }];
afterEach(cleanup);
describe('Vistas solicitadas por el anexo', () => {
  it('21 - categorías renderiza los enlaces correspondientes (props y DOM)', () => {
    render(<MemoryRouter><CategoriesPage products={initialProducts} categories={initialCategories} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /Frutas/ }).getAttribute('href')).toBe('/categorias/frutas');
    expect(screen.getByRole('link', { name: /Verduras/ })).toBeTruthy();
  });
  it('22 - ofertas muestra solo productos con descuento', () => {
    render(<MemoryRouter><OffersPage products={initialProducts} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.getAllByRole('button', { name: 'Agregar al carrito' }).length).toBe(2);
    expect(screen.queryByRole('heading', { name: 'Manzanas Orgánicas' })).toBeNull();
  });
  it('23 - checkout renderiza mensajes condicionales de validación', () => {
    const onComplete = jasmine.createSpy('onComplete');
    render(<MemoryRouter><CheckoutPage cart={testCart} user={null} onComplete={onComplete} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Selecciona una región.')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();
  });
  it('24 - autocompleta cliente y envía pedido aprobado usando mock', () => {
    const onComplete = jasmine.createSpy('onComplete');
    render(<MemoryRouter><CheckoutPage cart={testCart} user={{ name:'Ana Soto',email:'ana@test.cl' }} onComplete={onComplete}/></MemoryRouter>);
    expect(screen.getByLabelText('Nombre *').value).toBe('Ana');
    expect(screen.getByLabelText('Apellidos *').value).toBe('Soto');
    fireEvent.change(screen.getByLabelText('Calle y número *'), { target: { value:'Los Robles 50' } });
    fireEvent.change(screen.getByLabelText('Región *'), { target: { value:'Valparaíso' } });
    fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value:'Quilpué' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));
    expect(onComplete).toHaveBeenCalled();
    expect(onComplete.calls.mostRecent().args[0].status).toBe('pagado');
  });
  it('25 - permite simular un pago fallido y registrar su estado', () => {
    const onComplete = jasmine.createSpy('onComplete');
    render(<MemoryRouter><CheckoutPage cart={testCart} user={{ name:'Ana Soto', email:'ana@test.cl' }} onComplete={onComplete}/></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Calle y número *'), { target: { value:'Los Robles 50' } });
    fireEvent.change(screen.getByLabelText('Región *'), { target: { value:'Valparaíso' } });
    fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value:'Quilpué' } });
    fireEvent.change(screen.getByLabelText('Resultado de pago simulado'), { target: { value:'error' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));
    expect(onComplete.calls.mostRecent().args[0].status).toBe('rechazado');
  });
  it('26 - resultado de compra muestra pedido y su resumen', () => {
    const order = createOrder(testCart, { name:'Ana', lastName:'Soto', email:'ana@test.cl', street:'Calle 1', city:'Santiago', region:'RM' }, true);
    render(<MemoryRouter initialEntries={[`/compra/exito/${order.id}`]}><Routes><Route path="/compra/exito/:id" element={<OrderResultPage orders={[order]} approved/>}/></Routes></MemoryRouter>);
    expect(screen.getByText(/Compra realizada/)).toBeTruthy();
    expect(screen.getByText(order.number)).toBeTruthy();
    expect(screen.getByText('Total: $2.500')).toBeTruthy();
  });
});
