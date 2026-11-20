import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  CarritoContext
} from "../context/CarritoContext";

import "../styles/productos.css";
import { adaptProduct, getCategories, getProducts } from "../services/api";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("categoria") || "pulpas";
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCargando(true);
    setError("");
    const cargarProductos = async () => {
      try {
        const [productosApi, categoryList] = await Promise.all([getProducts(categorySlug), getCategories()]);

        setProductos(productosApi.map(adaptProduct));
        setCategories(categoryList);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, [categorySlug]);

  const selectedCategory = categories.find((item) => item.slug === categorySlug);

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
          {selectedCategory?.name || "Productos JuliT-REX"}
        </h1>
        <p className="catalog-intro">{selectedCategory?.description || "Sabores de fruta para preparar y disfrutar a tu manera."}</p>
        {categories.length > 1 && <nav className="catalog-category-tabs" aria-label="Categorías de productos">{categories.map((category) => <button type="button" key={category._id} className={category.slug === categorySlug ? "is-current" : ""} onClick={() => setSearchParams({ categoria: category.slug })}>{category.name}<span>{category.productCount}</span></button>)}</nav>}

        {cargando && (
          <p className="catalog-loading"><img src="/images/brand/fruit-loading.png" alt="" />Cargando productos...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p className="catalog-empty"><img src="/images/brand/fruit-loading.png" alt="" />No hay productos disponibles.</p>
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

              {producto.descripcion && <p className="producto-descripcion">{producto.descripcion}</p>}

              <p className={`precio${producto.promocion ? " has-promotion" : ""}`}>
                {producto.promocion && <><span className="precio-original">${Number(producto.precioOriginal).toLocaleString("es-CO")}</span><span className="promotion-label">Oferta</span></>}
                <strong>${Number(producto.precio).toLocaleString("es-CO")}</strong>
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
