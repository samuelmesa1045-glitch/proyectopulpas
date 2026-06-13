import { useContext, useEffect, useState } from "react";

import { CarritoContext } from "../context/CarritoContext";
import "../styles/productos.css";
import { adaptProduct, getFeaturedProducts } from "../services/api";

function ProductosDestacados() {

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  const [productos, setProductos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosApi = await getFeaturedProducts();

        setProductos(productosApi.map(adaptProduct));
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  return (

    <section className="productos">

      <h2 className="titulo-productos">
        Productos Destacados
      </h2>

      {cargando && (
        <p>Cargando productos...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!cargando && !error && productos.length === 0 && (
        <p>No hay productos destacados.</p>
      )}

      <div className="productos-grid">

        {productos.map((producto) => (

          <div
            className="producto"
            key={producto.id}
          >

            <img
              src={producto.imagen}
              alt={producto.nombre}
            />

            <h3>{producto.nombre}</h3>

            <p className="precio">
              ${producto.precio}
            </p>

            <button
              className="btn-agregar"
              onClick={() =>
                agregarAlCarrito(producto, 1)
              }
            >
              Agregar al carrito
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ProductosDestacados;
