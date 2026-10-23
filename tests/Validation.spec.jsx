import { validName, validEmail } from '../src/utils/validation.js';

describe('Validaciones de formularios', () => {
  it('rechaza nombres con números', () => {
    expect(validName('1111')).toBeFalse();
    expect(validName('Juan123')).toBeFalse();
    expect(validName('María José')).toBeTrue();
  });

  it('valida correctamente los correos', () => {
    expect(validEmail('aaaaa@.gmail.com')).toBeFalse();
    expect(validEmail('abc@gmail')).toBeFalse();
    expect(validEmail('juan@gmail.com')).toBeTrue();
  });
});