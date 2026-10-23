import { addItem, changeQuantity, cartTotal, cartCount, loadCart } from '../src/utils/storage.js';
import { initialProducts } from '../src/data/products.js';

describe('Lógica del carrito', () => {
  afterEach(() => localStorage.removeItem('huerto_cart'));

  it('12 - recupera datos guardados por el carrito original', () => {
    localStorage.setItem('huerto_cart', JSON.stringify([{ ...initialProducts[0], quantity: 2 }]));
    expect(loadCart()[0].quantity).toBe(2);
  });

  it('13 - agrega el producto sin duplicar filas ni modificar el original', () => {
    const oldCart = [{ ...initialProducts[0], quantity: 1 }];
    const updated = addItem(oldCart, initialProducts[0]);
    expect(updated.length).toBe(1);
    expect(updated[0].quantity).toBe(2);
    expect(oldCart[0].quantity).toBe(1);
  });

  it('14 - reduce cantidad, elimina al llegar a cero y calcula totales', () => {
    const previous = [{ ...initialProducts[0], quantity: 2 }];
    expect(cartTotal(previous)).toBe(5000);
    expect(cartCount(previous)).toBe(2);
    expect(changeQuantity(previous, 1, -2)).toEqual([]);
  });
});
