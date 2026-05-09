import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");

    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
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
        total
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};