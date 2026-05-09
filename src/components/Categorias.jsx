import { Link } from "react-router-dom";
import "../styles/categorias.css";

function Categorias() {
  return (

    <section className="categorias">

      <div className="categoria">

        <img
          src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
          alt="Pulpas"
        />

        <h2>Pulpas de Fruta</h2>

        <Link
          to="/productos"
          className="btn-categoria"
        >
          Ver Productos
        </Link>

      </div>

      <div className="categoria">

        <img
          src="https://images.unsplash.com/photo-1497534446932-c925b458314e"
          alt="Combos"
        />

        <h2>Combos Familiares</h2>

        <Link
          to="/paquetes"
          className="btn-categoria"
        >
          Comprar Ahora
        </Link>

      </div>

    </section>
  );
}

export default Categorias;