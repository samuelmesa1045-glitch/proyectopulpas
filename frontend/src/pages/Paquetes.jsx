import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CarritoContext } from "../context/CarritoContext";
import { adaptProduct, getProducts } from "../services/api";
import "../styles/productos.css";

function Paquetes() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getProducts("Paquetes")
      .then((items) => { if (mounted) setPaquetes(items.map(adaptProduct)); })
      .catch((requestError) => { if (mounted) setError(requestError.message); })
      .finally(() => { if (mounted) setCargando(false); });
    return () => { mounted = false; };
  }, []);

  return <>
    <Navbar />
    <section className="productos">
      <h1 className="titulo-productos">Paquetes JuliT-REX</h1>
      <p className="catalog-intro">Una selección tropical para compartir en casa.</p>
      {cargando && <p className="catalog-loading"><img src="/images/brand/fruit-loading.png" alt="" />Cargando paquetes...</p>}
      {error && <p role="alert">{error}</p>}
      {!cargando && !error && paquetes.length === 0 && <p className="catalog-empty">Pronto tendremos paquetes disponibles.</p>}
      <div className="productos-grid">
        {paquetes.map((paquete) => <article className="producto" key={paquete.id}>
          <img src={paquete.imagen} alt={paquete.nombre} />
          <h3>{paquete.nombre}</h3>
          {paquete.descripcion && <p className="producto-descripcion">{paquete.descripcion}</p>}
          <p className={`precio${paquete.promocion ? " has-promotion" : ""}`}>{paquete.promocion && <><span className="precio-original">${Number(paquete.precioOriginal).toLocaleString("es-CO")}</span><span className="promotion-label">Oferta</span></>}<strong>${Number(paquete.precio).toLocaleString("es-CO")}</strong></p>
          <button className="btn-agregar" onClick={() => agregarAlCarrito(paquete, 1)}>Agregar al carrito</button>
        </article>)}
      </div>
    </section>
    <Footer />
  </>;
}

export default Paquetes;
