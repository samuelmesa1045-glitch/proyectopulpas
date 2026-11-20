import { useCallback, useEffect, useState } from "react";
import { deleteAdminCategory, getAdminCategories, resolveImageUrl, saveAdminCategory, uploadAdminImage } from "../../services/api";

const newCategory = () => ({ name: "", description: "", image: "/images/brand/mascot-trex.png", active: false, sortOrder: 50 });

function AdminCategories({ token, onChanged }) {
  const [categories, setCategories] = useState([]);
  const [draft, setDraft] = useState(newCategory);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await getAdminCategories(token)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const clear = () => { setEditingId(""); setDraft(newCategory()); setError(""); setNotice(""); };
  const edit = (category) => {
    setEditingId(category._id);
    setDraft({ name: category.name, description: category.description || "", image: category.image || "", active: category.active, sortOrder: category.sortOrder || 0 });
    setError(""); setNotice("");
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try {
      const result = await uploadAdminImage(token, file);
      setDraft((current) => ({ ...current, image: result.image }));
    } catch (requestError) { setError(requestError.message); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const saved = await saveAdminCategory(token, { ...draft, sortOrder: Number(draft.sortOrder) }, editingId);
      setCategories((current) => editingId
        ? current.map((category) => category._id === saved._id ? saved : category)
        : [...current, saved].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)));
      setNotice(editingId ? "Categoría actualizada." : "Categoría creada; permanece oculta hasta publicarla.");
      setEditingId(""); setDraft(newCategory()); onChanged();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const toggle = async (category) => {
    setError(""); setNotice("");
    try {
      const saved = await saveAdminCategory(token, { ...category, active: !category.active }, category._id);
      setCategories((current) => current.map((item) => item._id === saved._id ? saved : item));
      setNotice(saved.active ? "Categoría publicada. Si tiene productos activos, ya aparece en la tienda." : "Categoría oculta de la tienda."); onChanged();
    } catch (requestError) { setError(requestError.message); }
  };

  const remove = async (category) => {
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    setError(""); setNotice("");
    try {
      await deleteAdminCategory(token, category._id);
      setCategories((current) => current.filter((item) => item._id !== category._id));
      setNotice("Categoría eliminada."); onChanged();
    } catch (requestError) { setError(requestError.message); }
  };

  return <div className="admin-management-layout">
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-editor-heading"><div><p className="admin-overline">CATEGORÍAS</p><h2>{editingId ? "Editar categoría" : "Nueva categoría"}</h2></div>{editingId && <button className="admin-text-button" type="button" onClick={clear}>Cancelar</button>}</div>
      <label>Nombre<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength="50" required /></label>
      <label>Descripción<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength="240" rows="3" /></label>
      <label>Imagen de categoría<input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} maxLength="500" placeholder="/images/brand/imagen.png" /></label>
      <label className="admin-upload-label">Subir imagen PNG, JPEG o WebP<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} disabled={uploading} /></label>
      <div className="admin-form-row">
        <label>Orden<input type="number" min="0" max="999" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: event.target.value })} /></label>
        <label className="admin-inline-check"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />Publicar</label>
      </div>
      {draft.image && <img className="admin-image-preview" src={resolveImageUrl(draft.image)} alt="Vista previa de categoría" />}
      {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
      {notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
      <button className="admin-save" disabled={saving || uploading}>{uploading ? "Subiendo imagen..." : saving ? "Guardando..." : editingId ? "Guardar categoría" : "Crear categoría"}</button>
    </form>

    <section className="admin-inventory">
      <div className="admin-inventory-heading"><div><p className="admin-overline">PUBLICACIÓN</p><h2>Gestión de categorías</h2></div><span>{categories.length} categorías</span></div>
      {loading ? <p className="admin-list-state">Cargando categorías...</p> : <div className="admin-category-list">
        {categories.map((category) => <article className={`admin-category-row${category.active ? "" : " is-inactive"}`} key={category._id}>
          <img src={resolveImageUrl(category.image || "/images/brand/mascot-trex.png")} alt="" />
          <div className="admin-product-info"><strong>{category.name}</strong><span>{category.slug} · {category.productCount} productos{category.isSystem ? " · Base" : ""}</span></div>
          <span className={`admin-status${category.active ? " is-active" : ""}`}>{category.active ? "Publicada" : "Oculta"}</span>
          <div className="admin-product-actions"><button type="button" onClick={() => edit(category)}>Editar</button><button type="button" onClick={() => toggle(category)}>{category.active ? "Ocultar" : "Publicar"}</button>{!category.isSystem && <button type="button" onClick={() => remove(category)}>Eliminar</button>}</div>
        </article>)}
      </div>}
    </section>
  </div>;
}

export default AdminCategories;
