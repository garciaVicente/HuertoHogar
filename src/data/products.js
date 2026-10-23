// Catálogo tomado del proyecto original HuertoHogar (rama main, octubre de 2026).
export const initialProducts = [
  { id: 1, stock: 20, name: 'Manzanas Orgánicas', category: 'frutas', price: 2500, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', description: 'Manzanas rojas crujientes y libres de pesticidas por kilo.' },
  { id: 2, stock: 3, name: 'Tomates Limachinos', category: 'verduras', price: 1800, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', description: 'Tomates de sabor intenso cultivados localmente por kilo.' },
  { id: 3, stock: 20, discount: 15, name: 'Miel Orgánica Natural', category: 'despensa', price: 5500, image: 'https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?w=400', description: 'Miel 100% pura de floración nativa, frasco de 500g.' },
  { id: 4, stock: 2, name: 'Espinaca Fresca', category: 'verduras', price: 1200, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Manojo de espinaca recién cosechada, rica en hierro.' },
  { id: 5, stock: 12, name: 'Naranjas de Cítrico', category: 'frutas', price: 2200, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', description: 'Jugosas naranjas de estación por kilo.' },
  { id: 6, stock: 10, discount: 10, name: 'Aceite de Oliva Extra Virgen', category: 'despensa', price: 7900, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', description: 'Prensado en frío, botella de cristal de 1 litro.' }
];
export const formatPrice = value => '$' + Number(value).toLocaleString('es-CL');
