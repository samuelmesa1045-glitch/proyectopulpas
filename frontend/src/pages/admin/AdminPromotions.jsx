import { useCallback, useEffect, useState } from "react";
import { getAdminProducts, getAdminPromotions, resolveImageUrl, saveAdminPromotion, uploadAdminImage, deleteAdminPromotion } from "../../services/api";

const fresh = () => ({ title: "", description: "", productIds: [], discountType: "percentage", discountValue: "", startsAt: "", endsAt: "", image: "/images/brand/promo-background.png", active: true });
const localDate = (value) => value ? new Date(value).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) : "";
const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

function AdminPromotions({ token }) {
  const [products, setProducts] = useState([]); const [promotions, setPromotions] = useState([]);
  const [draft, setDraft] = useState(fresh); const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const load = useCallback(async () => { setLoading(true); try { const [allProducts, allPromos] = await Promise.all([getAdminProducts(token), getAdminPromotions(token)]); setProducts(allProducts.filter((item) => item.active)); setPromotions(allPromos); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [token]);
  useEffect(() => { load(); }, [load]);
  const clear = () => { setEditingId(""); setDraft(fresh()); setError(""); setNotice(""); };
  const edit = (item) => { setEditingId(item._id); setDraft({ title: item.title, description: item.description || "", productIds: item.productIds.map(String), discountType: item.discountType, discountValue: item.discountValue, startsAt: new Date(item.startsAt).toISOString().slice(0, 16), endsAt: new Date(item.endsAt).toISOString().slice(0, 16), image: item.image || "", active: item.active }); setError(""); setNotice(""); };
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); setError(""); try { const result = await uploadAdminImage(token, file); setDraft((current) => ({ ...current, image: result.image })); } catch (e) { setError(e.message); } finally { setUploading(false); event.target.value = ""; } };
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(""); setNotice(""); try { const wasEditing = Boolean(editingId); const payload = { ...draft, discountValue: Number(draft.discountValue), startsAt: new Date(draft.startsAt).toISOString(), endsAt: new Date(draft.endsAt).toISOString() }; await saveAdminPromotion(token, payload, editingId); await load(); setEditingId(""); setDraft(fresh()); setNotice(wasEditing ? "Promoción actualizada." : "Promoción guardada."); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  const remove = async (item) => { if (!window.confirm(`¿Eliminar la promoción "${item.title}"?`)) return; try { await deleteAdminPromotion(token, item._id); setPromotions((current) => current.filter((promo) => promo._id !== item._id)); setNotice("Promoción eliminada."); } catch (e) { setError(e.message); } };
  return <div className="admin-products-layout">
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-editor-heading"><div><p className="admin-overline">OFERTAS CON PRECIO REAL</p><h2>{editingId ? "Editar promoción" : "Nueva promoción"}</h2></div>{editingId && <button type="button" className="admin-text-button" onClick={clear}>Cancelar</button>}</div>
      <label>Título<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength="80" required /></label>
      <label>Descripción<textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength="300" rows="3" /></label>
      <label>Productos incluidos<select multiple value={draft.productIds} onChange={(e) => setDraft({ ...draft, productIds: [...e.target.selectedOptions].map((option) => option.value) })} required>{products.map((product) => <option key={product._id} value={product._id}>{product.name} · {money(product.price)}</option>)}</select></label>
      <div className="admin-form-row"><label>Tipo<select value={draft.discountType} onChange={(e) => setDraft({ ...draft, discountType: e.target.value })}><option value="percentage">Porcentaje</option><option value="fixed">Descuento en pesos</option></select></label><label>{draft.discountType === "percentage" ? "Descuento (%)" : "Descuento (COP)"}<input type="number" min="1" step="1" max={draft.discountType === "percentage" ? 100 : undefined} value={draft.discountValue} onChange={(e) => setDraft({ ...draft, discountValue: e.target.value })} required /></label></div>
      <div className="admin-form-row"><label>Inicia<input type="datetime-local" value={draft.startsAt} onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })} required /></label><label>Finaliza<input type="datetime-local" value={draft.endsAt} onChange={(e) => setDraft({ ...draft, endsAt: e.target.value })} required /></label></div>
      <label>Imagen promocional (opcional)<input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} maxLength="500" /></label>
      <label className="admin-upload-label">Subir imagen PNG, JPEG o WebP<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} disabled={uploading} /></label>
      {draft.image && <img className="admin-image-preview" src={resolveImageUrl(draft.image)} alt="Vista previa promocional" />}
      <label className="admin-inline-check"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />Promoción habilitada</label>
      {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}{notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
      <button className="admin-save" disabled={saving || uploading}>{uploading ? "Subiendo..." : saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear promoción"}</button>
    </form>
    <section className="admin-inventory"><div className="admin-inventory-heading"><div><p className="admin-overline">PROGRAMACIÓN</p><h2>Promociones</h2></div><span>{promotions.length} en total</span></div>
      {loading ? <p className="admin-list-state">Cargando promociones...</p> : !promotions.length ? <p className="admin-list-state">Aún no hay promociones. Las ofertas se mostrarán solo dentro de sus fechas programadas.</p> : <div className="admin-promotion-list">{promotions.map((item) => <article className="admin-promotion-row" key={item._id}>
        {item.image && <img src={resolveImageUrl(item.image)} alt="" />}<div className="admin-product-info"><strong>{item.title}</strong><span>{item.discountType === "percentage" ? `${item.discountValue}% de descuento` : `${money(item.discountValue)} de descuento`} · {item.products.map((p) => p.name).join(", ")}</span><small>{localDate(item.startsAt)} – {localDate(item.endsAt)}</small></div><span className={`admin-status ${item.status === "active" ? "is-active" : ""}`}>{({ active: "Activa", scheduled: "Programada", expired: "Finalizada", paused: "Pausada" })[item.status]}</span><div className="admin-product-actions"><button type="button" onClick={() => edit(item)}>Editar</button><button type="button" onClick={() => remove(item)}>Eliminar</button></div>
      </article>)}</div>}
    </section>
  </div>;
}
export default AdminPromotions;
