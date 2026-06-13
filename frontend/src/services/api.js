const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window === "undefined") {
    return "http://localhost:4000/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
};

const API_URL = getApiUrl();

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  return response.json();
};

export const getFeaturedProducts = async () => {
  const response = await fetch(`${API_URL}/products/featured`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos destacados");
  }

  return response.json();
};

export const adaptProduct = (product) => ({
  id: product._id || product.id,
  nombre: product.name || product.nombre,
  precio: product.price || product.precio,
  imagen: product.image || product.imagen,
});
