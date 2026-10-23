import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { salePrice } from '../utils/storage.js';

export default function ProductCard({ product, onAdd }) {
  return <article className="card h-100 border-0 shadow-sm product-card">
    <Link to={`/productos/${product.id}`}><img className="card-img-top product-img" src={product.image} alt={product.name} loading="lazy" /></Link>
    <div className="card-body d-flex flex-column">
      <small className="text-success text-capitalize">{product.category}</small>
      <h3 className="h5 mt-1"><Link className="text-decoration-none text-dark" to={`/productos/${product.id}`}>{product.name}</Link></h3>
      <p className="text-muted small flex-grow-1">{product.description}</p>
      {product.discount > 0 && <p className="mb-1"><span className="badge text-bg-danger">-{product.discount}%</span> <del className="text-muted">{formatPrice(product.price)}</del></p>}
      <p className="fs-5 fw-bold text-success mb-2">{formatPrice(salePrice(product))}</p>
      <button className="btn btn-success" type="button" onClick={() => onAdd(product)}>Agregar al carrito</button>
    </div>
  </article>;
}
