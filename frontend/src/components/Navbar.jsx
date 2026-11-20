import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { CarritoContext } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

import "../styles/navbar.css";

function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

    const {
  carrito,
  eliminarProducto,
  aumentarCantidad,
  disminuirCantidad,
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

    if (!session) {
      setAbrirCarrito(false);
      navigate("/acceso?next=checkout");
      return;
    }

    navigate("/checkout");
    setAbrirCarrito(false);
    return;

  };

  return (
    <>
      <header className="header">

        <div className="logo">
          <Link to="/" aria-label="JuliT-REX, inicio">
            <img src="/images/brand/logo-tropical.png" alt="JuliT-REX, pulpas 100% naturales" />
          </Link>
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

        <img className="navbar-animation" src="/images/brand/navbar-animation.gif" alt="" aria-hidden="true" />

        <div className="header-info">

          {session ? (
            <>
              <Link className="telefono" to={session.user.role === "admin" ? "/admin" : "/"}>{session.user.name}</Link>
              {session.user.role === "buyer" && <button type="button" className="nav-signout" onClick={() => { signOut(); navigate("/"); }}>Salir</button>}
            </>
          ) : (
            <Link className="telefono" to="/acceso">Ingresar</Link>
          )}

          <button
            type="button"
            className="carrito"
            aria-label={`Abrir carrito, ${cantidadTotal} productos`}
            aria-expanded={abrirCarrito}
            onClick={() =>
              setAbrirCarrito(!abrirCarrito)
            }
          >
            🛒
            <span key={cantidadTotal} className="contador-carrito">
              {cantidadTotal}
            </span>
          </button>

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

          <button
            type="button"
            className="cerrar"
            aria-label="Cerrar carrito"
            onClick={() =>
              setAbrirCarrito(false)
            }
          >
            ✖
          </button>

        </div>

        <div className="lista-carrito">

          {carrito.length === 0 ? (

            <p className="carrito-vacio">
              <img src="/images/brand/fruit-loading.png" alt="" />
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

                 <div className="controles-cantidad">

  <button
    className="btn-cantidad"
    onClick={() =>
      disminuirCantidad(item.nombre)
    }
  >
    -
  </button>

  <span>
    {item.cantidad}
  </span>

  <button
    className="btn-cantidad"
    onClick={() =>
      aumentarCantidad(item.nombre)
    }
  >
    +
  </button>

</div>

<p>
  ${item.precio}
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
