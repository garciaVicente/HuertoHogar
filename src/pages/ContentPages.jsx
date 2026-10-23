import React from 'react';
import { Link, useParams } from 'react-router-dom';

const posts = [
  { id: '1', title: 'Consejos para una alimentación consciente', subtitle: 'Pequeños cambios para incorporar más alimentos frescos.', text: 'Planifica tus comidas de la semana, prefiere alimentos de estación y aprovecha las frutas y verduras de los productores locales. Una alimentación consciente empieza con decisiones sencillas todos los días.' },
  { id: '2', title: 'Cómo crear tu propio huerto en casa', subtitle: 'Descubre cómo empezar a cultivar en espacios pequeños.', text: 'Puedes iniciar con maceteros, sustrato adecuado y hierbas como albahaca o perejil. Ubícalos donde reciban luz natural, revisa la humedad del suelo y disfruta del proceso de cultivo.' }
];
export function BlogPage() {
  return <div className="container py-5"><h1>Blog y sostenibilidad</h1><p className="text-muted">Ideas para una vida más natural.</p><div className="row g-4">{posts.map(post => <div className="col-md-6" key={post.id}><article className="card h-100 border-0 shadow-sm"><div className="card-body"><span className="fs-1">{post.id === '1' ? '🥕' : '🌿'}</span><h2 className="h4">{post.title}</h2><p>{post.subtitle}</p><Link to={`/blogs/${post.id}`}>Leer artículo →</Link></div></article></div>)}</div></div>;
}
export function ArticlePage() {
  const { id } = useParams(); const post = posts.find(p => p.id === id);
  if (!post) return <div className="container py-5">Artículo no encontrado. <Link to="/blogs">Volver al blog</Link></div>;
  return <article className="container py-5" style={{maxWidth: 820}}><Link to="/blogs">← Volver al blog</Link><h1 className="mt-3">{post.title}</h1><p className="lead">{post.subtitle}</p><p>{post.text}</p></article>;
}
export function AboutPage() {
  return <div className="container py-5"><h1>Sobre HuertoHogar</h1><p className="lead">Una tienda online para acercar alimentos orgánicos y naturales a más hogares.</p><div className="row g-4 mt-3"><div className="col-md-6"><div className="soft-block rounded-4 p-4 h-100"><h2 className="h4">Nuestra misión</h2><p>Facilitar la compra de productos frescos, promoviendo una alimentación consciente y apoyando a productores locales.</p></div></div><div className="col-md-6"><div className="soft-block rounded-4 p-4 h-100"><h2 className="h4">Nuestros valores</h2><p>Calidad, cercanía, confianza y respeto por el entorno.</p></div></div></div></div>;
}
