import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, resolveImageUrl } from "../services/api";
import "../styles/categorias.css";

const benefits = [["✦", "100% naturales"], ["✓", "Fruta seleccionada"], ["❋", "Sabor que se disfruta"], ["♥", "Hecho con cariño"]];

function Categorias() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);
  const comingSoon = !categories.some((category) => !["pulpas", "paquetes"].includes(category.slug));
  return <>
    <section className="brand-benefits" aria-label="Beneficios JuliT-REX">{benefits.map(([icon, label]) => <div className="brand-benefit" key={label}><span aria-hidden="true">{icon}</span><strong>{label}</strong></div>)}</section>
    {comingSoon ? <section className="coming-soon" aria-labelledby="coming-soon-title">
      <img src="/images/brand/mascot-trex.png" alt="Mascota JuliT-REX" />
      <div><p className="coming-soon-eyebrow">La aventura sigue creciendo</p><h2 id="coming-soon-title">¡Más productos pronto!</h2><p>Estamos preparando nuevas formas de disfrutar tus sabores favoritos.</p></div>
    </section> : <section className="store-categories" aria-labelledby="store-categories-title">
      <div className="store-categories-heading"><p>Descubre el sabor</p><h2 id="store-categories-title">Explora nuestras categorías</h2></div>
      <div className="store-category-grid">{categories.map((category) => <Link key={category._id} to={`/productos?categoria=${encodeURIComponent(category.slug)}`} className="store-category">
        <img src={resolveImageUrl(category.image || "/images/brand/mascot-trex.png")} alt="" /><div><h3>{category.name}</h3><p>{category.description || `${category.productCount} opciones para elegir`}</p><span>Ver {category.productCount} productos</span></div>
      </Link>)}</div>
    </section>}
  </>;
}
export default Categorias;
