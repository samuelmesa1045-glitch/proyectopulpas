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
      "https://imgs.search.brave.com/QaaehKqWmNxX_YkWtx5S4Kj1smRseAGeFSHBKvM9U9Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzA3LzI1LzMx/LzM2MF9GXzMwNzI1/MzEyNV9RSlhBWFBS/ZmFTQzJwaFVXQWNr/cjl6SUd3azN3VkZz/bC5qcGc"
  },

  {
    id: 3,
    nombre: "Pulpa de Maracuyá",
    precio: 6500,
    imagen:
      "https://imgs.search.brave.com/GnT7e49Kqte--FcNddWTgdYpjl5QIcqAVq2KsqoSZ6g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi96dW1v/LWRlLW1hcmFjdXlh/LWZydXRhLWFwYXNp/b25hZGEtY29uLWxh/LXBhc2klQzMlQjNu/LXZhc28tY2VycmFk/by1tZWRpby10cm96/by15LWhvamEtdmVy/ZGUtYWlzbGFkYS1l/bi1mb25kby1ibGFu/Y28tY29uY2VwdG8t/YmViaWRhcy0xOTMw/Nzc1MzEuanBn"
  },

  {
    id: 4,
    nombre: "Pulpa de Guanábana",
    precio: 7000,
    imagen:
      "https://imgs.search.brave.com/9SA95H21Wm6rfxgmy4edZlloBDVNNg-INrbNaNfI8aE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZXhp/Y29uZXdzZGFpbHku/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIzLzA2L1Ryb3BU/YWJsZV9HdWFuYWJh/bmEtQmF0aWRvMi02/OTZ4NTIyLmpwZw"
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