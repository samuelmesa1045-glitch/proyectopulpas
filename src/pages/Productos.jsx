import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useContext, useState } from "react";

import {
  CarritoContext
} from "../context/CarritoContext";

import "../styles/productos.css";

const productos = [

  {
    id: 1,
    nombre: "Pulpa de Fresa",
    precio: 6000,
    imagen:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6"
  },

  {
    id: 2,
    nombre: "Pulpa de Mango",
    precio: 5500,
    imagen:
      "https://images.unsplash.com/photo-1553279768-865429fa0078"
  },

  {
    id: 3,
    nombre: "Pulpa de Maracuyá",
    precio: 6500,
    imagen:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b"
  },

  {
    id: 4,
    nombre: "Pulpa de Guanábana",
    precio: 7000,
    imagen:
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
  }

];

function Productos() {

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  const [cantidades, setCantidades] =
    useState({});

  // CAMBIAR CANTIDAD

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

              {/* INPUT */}

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