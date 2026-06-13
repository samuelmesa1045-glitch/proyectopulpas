import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useContext, useEffect, useState } from "react";

import {
  CarritoContext
} from "../context/CarritoContext";

import "../styles/productos.css";
import { adaptProduct, getProducts } from "../services/api";

function Productos() {

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  const [productos, setProductos] =
    useState([]);

  const [cantidades, setCantidades] =
    useState({});

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosApi = await getProducts();

        setProductos(productosApi.map(adaptProduct));
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const cambiarCantidad = (
    id,
    valor
  ) => {

    setCantidades({
      ...cantidades,
      [id]: Number(valor)
    });
  };

  return (
    <>
      <Navbar />

      <section className="productos">

        <h1 className="titulo-productos">
          Todos los Productos
        </h1>

        {cargando && (
          <p>Cargando productos...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p>No hay productos disponibles.</p>
        )}

        <div className="productos-grid">

          {productos.map(producto => (

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

              <input
                type="number"
                min="1"
                value={
                  cantidades[producto.id] || 1
                }
                onChange={(e) =>
                  cambiarCantidad(
                    producto.id,
                    e.target.value
                  )
                }
                className="cantidad"
              />

              <button
                className="btn-agregar"
                onClick={() =>
                  agregarAlCarrito(
                    producto,
                    cantidades[producto.id] || 1
                  )
                }
              >
                Agregar al carrito
              </button>

            </div>

          ))}

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Productos;
