import { Link } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-text">

        <h1>PULPAS 100% NATURALES</h1>

        <p>
          Disfruta el sabor real de la fruta fresca,
          sin conservantes y listas para preparar
          tus jugos favoritos.
        </p>

        <Link
          to="/productos"
          className="btn-hero"
        >
          Comprar Ahora
        </Link>

      </div>

    </section>
  );
}

export default Hero;