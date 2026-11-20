import { createContext, useCallback, useState, useEffect, useRef } from "react";
import { adaptProduct, getProducts } from "../services/api";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");

    return guardado ? JSON.parse(guardado) : [];
  });
  const carritoRef = useRef(carrito);

  const refreshCartFromCatalog = useCallback(async () => {
    const products = (await getProducts()).map(adaptProduct);
    const byId = new Map(products.map((product) => [String(product.id), product]));
    const byName = new Map(products.map((product) => [`${product.categoria}:${product.nombre.toLocaleLowerCase()}`, product]));
    const unavailable = [];

    const currentCart = carritoRef.current;
    const updatedCart = currentCart.flatMap((item) => {
      const name = item.nombre.toLocaleLowerCase();
      const latest = byId.get(String(item.id))
        || byName.get(`${item.categoria || "Pulpas"}:${name}`)
        || products.find((product) => product.nombre.toLocaleLowerCase() === name);
      if (!latest) {
        unavailable.push(item.nombre);
        return [];
      }
      return [{ ...item, ...latest, cantidad: item.cantidad }];
    });

    carritoRef.current = updatedCart;
    setCarrito(updatedCart);
    return unavailable;
  }, []);

  useEffect(() => {
    carritoRef.current = carrito;
    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    );
  }, [carrito]);

  // AGREGAR PRODUCTO
  const agregarAlCarrito = (producto, cantidad) => {

    const existe = carrito.find(
      item => item.nombre === producto.nombre
    );

    if (existe) {

      const nuevoCarrito = carrito.map(item =>
        item.nombre === producto.nombre
          ? {
              ...item,
              cantidad: item.cantidad + cantidad
            }
          : item
      );

      setCarrito(nuevoCarrito);

    } else {

      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad
        }
      ]);

    }
  };

  // ELIMINAR
  const eliminarProducto = (nombre) => {

    const nuevoCarrito = carrito.filter(
      item => item.nombre !== nombre
    );

    setCarrito(nuevoCarrito);
  };
  // AUMENTAR CANTIDAD

const aumentarCantidad = (nombre) => {

  const nuevoCarrito = carrito.map(item =>

    item.nombre === nombre

      ? {
          ...item,
          cantidad: item.cantidad + 1
        }

      : item
  );

  setCarrito(nuevoCarrito);
};

// DISMINUIR CANTIDAD

const disminuirCantidad = (nombre) => {

  const nuevoCarrito = carrito.map(item =>

    item.nombre === nombre

      ? {
          ...item,
          cantidad: item.cantidad - 1
        }

      : item
  )

  .filter(item => item.cantidad > 0);

  setCarrito(nuevoCarrito);
};

  // TOTAL
  const total = carrito.reduce(
    (acc, item) =>
      acc + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
  carrito,
  agregarAlCarrito,
  eliminarProducto,
  aumentarCantidad,
  disminuirCantidad,
          total,
          refreshCartFromCatalog
}}
    >
      {children}
    </CarritoContext.Provider>
  );
};
