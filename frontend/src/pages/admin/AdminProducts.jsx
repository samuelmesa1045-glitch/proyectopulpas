import { useCallback, useEffect, useMemo, useState } from "react";
import { adaptProduct, deleteAdminProduct, getAdminProducts, resolveImageUrl, saveAdminProduct, uploadAdminImage } from "../../services/api";

const IMAGE_OPTIONS = [
  ["Mango", "/images/brand/fruit-mango.png"],
  ["Fresa", "/images/brand/fruit-strawberry.png"],
  ["Maracuyá", "/images/brand/fruit-passionfruit.png"],
  ["Guayaba", "/images/brand/fruit-guava.png"],
  ["Guanábana", "/images/brand/fruit-soursop.png"],
  ["Paquete surtido", "/images/brand/pack-assorted.png"],
  ["Paquete tropical", "/images/brand/pack-tropical.png"],
];

const emptyDraft = (category) => ({
  name: "", price: "", image: category === "Paquetes" ? IMAGE_OPTIONS[5][1] : IMAGE_OPTIONS[0][1],
  category: category || "Pulpas", description: "", stock: 0, featured: false, active: true,
});
const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

function AdminProducts({ token, categories, categoryFilter, onChanged }) {
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState(() => emptyDraft(categoryFilter));
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try { setProducts(await getAdminProducts(token)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const listedProducts = useMemo(() => categoryFilter === "Paquetes"
    ? products.filter((product) => product.category === "Paquetes")
    : products.filter((product) => product.category !== "Paquetes"), [products, categoryFilter]);

  const startNew = () => {
    setEditingId(""); setDraft(emptyDraft(categoryFilter)); setError(""); setNotice("");
  };

  const editProduct = (product) => {
    const item = adaptProduct(product);
    setEditingId(product._id);
    setDraft({
      name: product.name, price: product.price, image: product.image?.startsWith("/api/uploads/") ? product.image : item.imagen,
      category: product.category || "Pulpas", description: product.description || "", stock: product.stock || 0,
      featured: Boolean(product.featured), active: product.active !== false,
    });
    setError(""); setNotice("");
    document.querySelector(".admin-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeField = (event) => {
    const { name, value, type, checked } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { image: value === "Paquetes" ? IMAGE_OPTIONS[5][1] : IMAGE_OPTIONS[0][1], featured: value === "Pulpas" ? current.featured : false } : {}),
    }));
  };

  const chooseFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try {
      const result = await uploadAdminImage(token, file);
      setDraft((current) => ({ ...current, image: result.image }));
    } catch (requestError) { setError(requestError.message); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const saveProduct = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const saved = await saveAdminProduct(token, { ...draft, price: Number(draft.price), stock: Number(draft.stock) }, editingId);
      setProducts((current) => editingId
        ? current.map((product) => product._id === saved._id ? saved : product)
        : [...current, saved].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
      setNotice(editingId ? "Producto actualizado." : "Producto añadido al catálogo.");
      setEditingId(""); setDraft(emptyDraft(categoryFilter)); onChanged();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const toggleVisibility = async (product) => {
    setBusyId(product._id); setError(""); setNotice("");
    try {
      const saved = await saveAdminProduct(token, { ...product, active: !product.active }, product._id);
      setProducts((current) => current.map((item) => item._id === saved._id ? saved : item));
      setNotice(saved.active ? "Producto publicado." : "Producto oculto; se conserva su registro."); onChanged();
    } catch (requestError) { setError(requestError.message); }
    finally { setBusyId(""); }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
    setBusyId(product._id); setError(""); setNotice("");
    try {
      await deleteAdminProduct(token, product._id);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      setNotice("Producto eliminado."); onChanged();
    } catch (requestError) { setError(requestError.message); }
    finally { setBusyId(""); }
  };

  const imageChoice = IMAGE_OPTIONS.some(([, path]) => path === draft.image) ? draft.image : "custom";
  const visibleCategories = categories.length ? categories : [{ name: "Pulpas" }, { name: "Paquetes" }];

  return <div className="admin-products-layout">
    <form className="admin-editor" onSubmit={saveProduct}>
      <div className="admin-editor-heading"><div><p className="admin-overline">CATÁLOGO</p><h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2></div>{editingId && <button className="admin-text-button" type="button" onClick={startNew}>Cancelar</button>}</div>
      <label>Nombre del producto<input name="name" value={draft.name} onChange={changeField} maxLength="100" required /></label>
      <div className="admin-form-row">
        <label>Precio base (COP)<input name="price" type="number" min="1" step="1" value={draft.price} onChange={changeField} required /></label>
        <label>Categoría<select name="category" value={draft.category} onChange={changeField}>{visibleCategories.map((category) => <option value={category.name} key={category._id || category.name}>{category.name}{category.active === false ? " · oculta" : ""}</option>)}</select></label>
      </div>
      <label>Imagen de JuliT-REX
        <select value={imageChoice} onChange={(event) => { if (event.target.value !== "custom") setDraft((current) => ({ ...current, image: event.target.value })); }}>
          {IMAGE_OPTIONS.map(([label, path]) => <option value={path} key={path}>{label}</option>)}
          <option value="custom">Otra ruta o imagen subida</option>
        </select>
      </label>
      <label>Ruta de imagen<input name="image" value={draft.image} onChange={changeField} placeholder="/images/brand/mi-producto.png" maxLength="500" required /></label>
      <label className="admin-upload-label">Subir imagen PNG, JPEG o WebP<input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} disabled={uploading} /></label>
      <label>Descripción<textarea name="description" value={draft.description} onChange={changeField} maxLength="300" rows="3" placeholder="Descripción breve para la tienda" /></label>
      <label>Unidades disponibles<input name="stock" type="number" min="0" step="1" value={draft.stock} onChange={changeField} required /></label>
      <div className="admin-checks">
        {draft.category === "Pulpas" && <label><input name="featured" type="checkbox" checked={draft.featured} onChange={changeField} />Destacar en inicio</label>}
        <label><input name="active" type="checkbox" checked={draft.active} onChange={changeField} />Publicado en la tienda</label>
      </div>
      {draft.image && <img className="admin-image-preview" src={resolveImageUrl(draft.image)} alt="Vista previa del producto" />}
      {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
      {notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
      <button className="admin-save" type="submit" disabled={saving || uploading}>{uploading ? "Subiendo imagen..." : saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar producto"}</button>
    </form>

    <section className="admin-inventory" aria-labelledby="inventory-heading">
      <div className="admin-inventory-heading"><div><p className="admin-overline">INVENTARIO</p><h2 id="inventory-heading">{categoryFilter === "Paquetes" ? "Paquetes de venta" : "Productos de la tienda"}</h2></div><span>{listedProducts.length} en total</span></div>
      {loading ? <p className="admin-list-state">Cargando catálogo...</p> : listedProducts.length === 0 ? <p className="admin-list-state">Aún no hay productos en esta sección.</p> : <div className="admin-product-list">
        {listedProducts.map((product) => {
          const item = adaptProduct(product);
          return <article className={`admin-product-row${product.active ? "" : " is-inactive"}`} key={product._id}>
            <img src={item.imagen} alt="" />
            <div className="admin-product-info"><strong>{product.name}</strong><span>{product.category}{product.featured ? " · Destacado" : ""} · Inventario: {product.stock || 0}</span></div>
            <strong className="admin-product-price">{money(product.price)}</strong>
            <span className={`admin-status${product.active ? " is-active" : ""}`}>{product.active ? "Publicado" : "Oculto"}</span>
            <div className="admin-product-actions">
              <button type="button" onClick={() => editProduct(product)}>Editar</button>
              <button type="button" disabled={busyId === product._id} onClick={() => toggleVisibility(product)}>{busyId === product._id ? "..." : product.active ? "Ocultar" : "Publicar"}</button>
              <button type="button" disabled={busyId === product._id} onClick={() => removeProduct(product)}>Eliminar</button>
            </div>
          </article>;
        })}
      </div>}
    </section>
  </div>;
}

export default AdminProducts;
