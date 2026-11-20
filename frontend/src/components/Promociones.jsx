import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicPromotions, adaptProduct, resolveImageUrl } from "../services/api";
import "../styles/categorias.css";

const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);
function Promociones() {
  const [promotions, setPromotions] = useState([]);
  useEffect(() => { getPublicPromotions().then(setPromotions).catch(() => setPromotions([])); }, []);
  if (!promotions.length) return null;
  return <section className="live-promotions" aria-labelledby="live-promotions-title">
    <header><p>Por tiempo limitado</p><h2 id="live-promotions-title">¡Ofertas especiales!</h2><span>Precios promocionales disponibles ahora</span></header>
    <div className="live-promotion-list">{promotions.map((promotion) => <article className="live-promotion" key={promotion._id}>
      {promotion.image && <img className="live-promotion-art" src={resolveImageUrl(promotion.image)} alt="" />}
      <div className="live-promotion-copy"><h3>{promotion.title}</h3>{promotion.description && <p>{promotion.description}</p>}</div>
      <div className="live-promotion-products">{promotion.products.map((raw) => { const product = adaptProduct(raw); return <Link to={product.categoria === "Paquetes" ? "/paquetes" : "/productos"} className="live-promotion-product" key={product.id}>
        <img src={product.imagen} alt="" /><strong>{product.nombre}</strong><span className="promotion-old-price">{money(product.precioOriginal)}</span><span className="promotion-sale-price">{money(product.precio)}</span>
      </Link>; })}</div>
    </article>)}</div>
  </section>;
}
export default Promociones;
