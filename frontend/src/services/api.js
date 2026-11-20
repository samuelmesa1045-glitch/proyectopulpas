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
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const resolveImageUrl = (image) => image?.startsWith("/api/uploads/")
  ? `${API_ORIGIN}${image}`
  : image;

const readResponse = async (response) => {
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "No se pudo completar la solicitud.");
  return result;
};

const adminRequest = async (resource, token, method = "GET", data) => {
  const response = await fetch(`${API_URL}/${resource}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return readResponse(response);
};

export const authRequest = async (path, data) => {
  const response = await fetch(`${API_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || "No se pudo completar el acceso.");
    error.code = result.code;
    throw error;
  }
  return result;
};

export const verifyEmail = (token) => authRequest("verify-email", { token });
export const resendVerification = (email) => authRequest("resend-verification", { email });

export const getProducts = async (category) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_URL}/products${query}`);

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

const adminProductRequest = async (token, path, method = "GET", product) => {
  const response = await fetch(`${API_URL}/products${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(product ? { "Content-Type": "application/json" } : {}),
    },
    ...(product ? { body: JSON.stringify(product) } : {}),
  });
  return readResponse(response);
};

export const getAdminProducts = (token) => adminProductRequest(token, "/admin");
export const saveAdminProduct = (token, product, id) =>
  adminProductRequest(token, id ? `/${encodeURIComponent(id)}` : "", id ? "PUT" : "POST", product);
export const deleteAdminProduct = (token, id) => adminProductRequest(token, `/${encodeURIComponent(id)}`, "DELETE");

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return readResponse(response);
};
export const getAdminCategories = (token) => adminRequest("categories/admin", token);
export const saveAdminCategory = (token, category, id) =>
  adminRequest(id ? `categories/${encodeURIComponent(id)}` : "categories", token, id ? "PUT" : "POST", category);
export const deleteAdminCategory = (token, id) => adminRequest(`categories/${encodeURIComponent(id)}`, token, "DELETE");

export const getPublicPromotions = async () => {
  const response = await fetch(`${API_URL}/promotions`);
  return readResponse(response);
};
export const getAdminPromotions = (token) => adminRequest("promotions/admin", token);
export const saveAdminPromotion = (token, promotion, id) =>
  adminRequest(id ? `promotions/${encodeURIComponent(id)}` : "promotions", token, id ? "PUT" : "POST", promotion);
export const deleteAdminPromotion = (token, id) => adminRequest(`promotions/${encodeURIComponent(id)}`, token, "DELETE");

export const uploadAdminImage = async (token, file) => {
  const response = await fetch(`${API_URL}/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": file.type },
    body: file,
  });
  return readResponse(response);
};

export const getStoreSettings = async () => {
  const response = await fetch(`${API_URL}/settings`);
  return readResponse(response);
};
export const saveStoreSettings = (token, settings) => adminRequest("settings", token, "PUT", settings);

export const adaptProduct = (product) => {
  const name = product.name || product.nombre;
  const normalizedName = name.toLowerCase();
  const brandImage = normalizedName.includes("mango")
    ? "/images/brand/fruit-mango.png"
    : normalizedName.includes("fresa")
      ? "/images/brand/fruit-strawberry.png"
      : normalizedName.includes("maracuya") || normalizedName.includes("maracuyá")
        ? "/images/brand/fruit-passionfruit.png"
        : normalizedName.includes("guayaba")
          ? "/images/brand/fruit-guava.png"
          : normalizedName.includes("guanabana") || normalizedName.includes("guanábana")
            ? "/images/brand/fruit-soursop.png"
          : null;
  const storedImage = product.image || product.imagen;
  const legacySeedImage = storedImage?.includes("imgs.search.brave.com")
    || storedImage === "https://images.unsplash.com/photo-1464965911861-746a04b4bca6";
  const image = resolveImageUrl(storedImage && !legacySeedImage ? storedImage : brandImage || storedImage);
  const basePrice = product.originalPrice ?? product.price ?? product.precio;
  const livePrice = product.salePrice ?? product.price ?? product.precio;

  return {
    id: product._id || product.id,
    nombre: name,
    precio: livePrice,
    precioOriginal: product.salePrice != null ? basePrice : null,
    promocion: product.promotion || null,
    imagen: image,
    descripcion: product.description || product.descripcion || "",
    categoria: product.category || product.categoria || "Pulpas",
  };
};
