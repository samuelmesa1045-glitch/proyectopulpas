import { useContext } from "react";

import { CarritoContext } from "../context/CarritoContext";

const productos = [

  {
    nombre: "Pulpa de Fresa",
    precio: 6000,
    imagen:
      "https://imgs.search.brave.com/2LOxsl1uL6KHT0xQswOfIeDHcxS4pfWr0p3_-c-Ceuo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0aWMudmVjdGVlenkuY29tL3N5c3RlbS9yZXNvdXJjZXMvdGh1bWJuYWlscy8wMjgvNjcyLzU0NC9zbWFsbC9zdHJhd2JlcnJ5LXNwbGFzaC1pbnRvLXJlZC1qdWljZS1saXF1aWQtYWktZ2VuZXJhdGVkLXBob3RvLmpwZw",
  },

  {
    nombre: "Pulpa de Mango",
    precio: 5500,
    imagen:
      "https://imgs.search.brave.com/QaaehKqWmNxX_YkWtx5S4Kj1smRseAGeFSHBKvM9U9Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5mdGNkbi5uZXQvanBnLzAzLzA3LzI1LzMxLzM2MF9GXzMwNzI1MzEyNV9RSlhBWFBSZmFTQzJwaFVXQWNrckp6SUd3azN3VkZzbC5qcGc",
  }

];

function ProductosDestacados() {

  const { agregarAlCarrito } =
    useContext(CarritoContext);

  return (

    <section className="productos">

      <h2 className="titulo-productos">
        Productos Destacados
      </h2>

      <div className="productos-grid">

        {productos.map((producto, index) => (

          <div
            className="producto"
            key={index}
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