import { createRecord, updateRecord, deleteRecord, createOrder, slug } from '../src/data/database.js';
import { salePrice, addItem } from '../src/utils/storage.js';
import { initialProducts } from '../src/data/products.js';

describe('Persistencia simulada y CRUD', () => {
  it('15 - crea un registro sin modificar el arreglo original', () => {
    const original = [{ id: 1, name: 'Manzanas' }];
    const next = createRecord(original, { name: 'Tomates' });
    expect(next.length).toBe(2);
    expect(next[1].id).toBe(2);
    expect(original.length).toBe(1);
  });
  it('16 - actualiza un registro por su identificador', () => {
    const next = updateRecord([{ id: 1, name: 'Viejo' }], 1, { name: 'Nuevo' });
    expect(next[0].name).toBe('Nuevo');
  });
  it('17 - elimina un registro por su identificador', () => {
    expect(deleteRecord([{ id: 1 }, { id: 2 }], 1)).toEqual([{ id: 2 }]);
  });
  it('18 - genera slug de categoría sin tildes', () => {
    expect(slug('Frutas de Estación')).toBe('frutas-de-estacion');
  });
  it('19 - aplica oferta al agregar producto al carrito', () => {
    const product = { id: 20, price: 1000, discount: 20, name: 'Prueba' };
    expect(salePrice(product)).toBe(800);
    expect(addItem([], product)[0].price).toBe(800);
  });
  it('20 - registra un pedido rechazado con total e ítems', () => {
    const order = createOrder([{ ...initialProducts[0], quantity: 2 }], { name: 'Ana' }, false);
    expect(order.status).toBe('rechazado');
    expect(order.total).toBe(5000);
    expect(order.items[0].quantity).toBe(2);
  });
});
