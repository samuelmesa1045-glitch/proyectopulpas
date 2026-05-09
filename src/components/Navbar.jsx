import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { CarritoContext } from "../context/CarritoContext";

import "../styles/navbar.css";

function Navbar() {

  const {
    carrito,
    eliminarProducto,
    total
  } = useContext(CarritoContext);

  const [abrirCarrito, setAbrirCarrito] =
    useState(false);

  // TOTAL PRODUCTOS

  const cantidadTotal = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  // FINALIZAR COMPRA

  const finalizarCompra = () => {

    if (carrito.length === 0) {

      alert("Tu carrito está vacío");

      return;
    }

    let mensaje =
      "Hola, quiero realizar el siguiente pedido:%0A%0A";

    carrito.forEach(item => {

      mensaje +=
        `• ${item.nombre} x ${item.cantidad} = $${

          item.precio * item.cantidad

        }%0A`;

    });

    mensaje += `%0ATotal: $${total}`;

    const telefono = "573001234567";

    const url =
      `https://wa.me/${telefono}?text=${mensaje}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <header className="header">

        <div className="logo">
          <h2>Pulpas</h2>
        </div>

        <nav className="nav">

          <ul>

            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/productos">
                Productos
              </Link>
            </li>

            <li>
              <Link to="/paquetes">
                Paquetes
              </Link>
            </li>

            <li>
              <Link to="/quienes">
                ¿Quiénes somos?
              </Link>
            </li>

            <li>
              <Link to="/contacto">
                Contacto
              </Link>
            </li>

          </ul>

        </nav>

        <div className="header-info">

          <span className="telefono">
            300 123 4567
          </span>

          <div
            className="carrito"
            onClick={() =>
              setAbrirCarrito(!abrirCarrito)
            }
          >

            🛒

            <span className="contador-carrito">
              {cantidadTotal}
            </span>

          </div>

        </div>

      </header>

      {/* PANEL CARRITO */}

      <div
        className={`carrito-panel ${
          abrirCarrito ? "activo" : ""
        }`}
      >

        <div className="carrito-header">

          <h2>Tu carrito</h2>

          <span
            className="cerrar"
            onClick={() =>
              setAbrirCarrito(false)
            }
          >
            ✖
          </span>

        </div>

        <div className="lista-carrito">

          {carrito.length === 0 ? (

            <p className="carrito-vacio">
              Tu carrito está vacío
            </p>

          ) : (

            carrito.map((item, index) => (

              <div
                className="item-carrito"
                key={index}
              >

                <div>

                  <h4>{item.nombre}</h4>

                  <p>
                    {item.cantidad} x $
                    {item.precio}
                  </p>

                </div>

                <button
                  className="btn-eliminar"
                  onClick={() =>
                    eliminarProducto(item.nombre)
                  }
                >
                  Eliminar
                </button>

              </div>

            ))

          )}

        </div>

        <div className="carrito-footer">

          <h3>
            Total: ${total}
          </h3>

          <button
            className="btn-finalizar"
            onClick={finalizarCompra}
          >
            Finalizar Compra
          </button>

        </div>

      </div>
    </>
  );
}

export default Navbar;