import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useContext } from "react";

import {
  CarritoContext
} from "../context/CarritoContext";

import "../styles/productos.css";

const paquetes = [

  {
    id: 1,
    nombre: "Combo Familiar",
    precio: 20000,
    imagen:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4"
  },

  {
    id: 2,
    nombre: "Pack Tropical",
    precio: 25000,
    imagen:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea"
  }

];

function Paquetes() {

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  return (
    <>
      <Navbar />

      <section className="productos">

        <h1 className="titulo-productos">
          Paquetes Especiales
        </h1>

        <div className="productos-grid">

          {paquetes.map(paquete => (

            <div
              className="producto"
              key={paquete.id}
            >

              <img
                src={paquete.imagen}
                alt={paquete.nombre}
              />

              <h3>{paquete.nombre}</h3>

              <p className="precio">
                ${paquete.precio}
              </p>

              <button
                className="btn-agregar"
                onClick={() =>
                  agregarAlCarrito(paquete, 1)
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

export default Paquetes;