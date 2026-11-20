import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import { getAdminCategories, getAdminProducts } from "../services/api";
import { BRAND_NAME } from "../config/brand";
import AdminCategories from "./admin/AdminCategories";
import AdminProducts from "./admin/AdminProducts";
import AdminPromotions from "./admin/AdminPromotions";
import "../styles/acceso.css";
import "../styles/admin.css";

function Admin() {
  const { session, signOut } = useAuth();
  const { settings, save: saveSettings } = useStoreSettings();
  const token = session?.token;
  const [section, setSection] = useState("resumen");
  const [counts, setCounts] = useState({ products: 0, categories: 0 });
  const [categories, setCategories] = useState([]);
  const [settingsDraft, setSettingsDraft] = useState({ whatsapp: "", location: "", tagline: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOverview = useCallback(() => {
    if (!token) return Promise.resolve();
    Promise.all([getAdminProducts(token), getAdminCategories(token)])
      .then(([products, resultCategories]) => { setCategories(resultCategories); setCounts({ products: products.length, categories: resultCategories.length }); })
      .catch((requestError) => setError(requestError.message));
  }, [token]);
  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => {
    setSettingsDraft({ whatsappNumber: settings.whatsappNumber || "", location: settings.location || "", tagline: settings.tagline || "" });
  }, [settings]);

  if (!session) return <Navigate to="/acceso" replace />;
  if (session.user.role !== "admin") return <Navigate to="/" replace />;

  const saveBusinessSettings = async (event) => {
    event.preventDefault(); setSavingSettings(true); setError(""); setMessage("");
    try { await saveSettings(token, settingsDraft); setMessage("Datos del negocio actualizados en la tienda."); }
    catch (requestError) { setError(requestError.message); }
    finally { setSavingSettings(false); }
  };

  const sections = [["resumen", "Resumen"], ["productos", "Productos y paquetes"], ["categorias", "Categorías"], ["promociones", "Promociones"], ["negocio", "Datos del negocio"]];
  return <main className="admin-page">
    <header className="admin-header"><Link to="/" className="access-brand"><img src="/images/brand/logo-tropical.png" alt={BRAND_NAME} /></Link><button onClick={signOut}>Cerrar sesión</button></header>
    <section className="admin-content admin-dashboard">
      <div className="admin-heading"><div><p className="access-eyebrow">ADMINISTRACIÓN</p><h1>Hola, {session.user.name}</h1><p>Administra lo que tus clientes ven en JuliT-REX.</p></div></div>
      <nav className="admin-tabs" aria-label="Administración">
        {sections.map(([id, label]) => <button type="button" key={id} className={section === id ? "is-current" : ""} onClick={() => { setSection(id); setError(""); setMessage(""); }}>{label}</button>)}
      </nav>
      {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
      {message && <p className="admin-feedback admin-feedback-success" role="status">{message}</p>}
      {section === "resumen" && <div className="admin-summary">
        <article><span>Productos registrados</span><strong>{counts.products}</strong><button onClick={() => setSection("productos")}>Administrar catálogo</button></article>
        <article><span>Categorías</span><strong>{counts.categories}</strong><button onClick={() => setSection("categorias")}>Administrar categorías</button></article>
        <article><span>Compra actual</span><strong>WhatsApp</strong><p>La tienda prepara el pedido y abre WhatsApp. No se simulan pagos ni facturas.</p></article>
      </div>}
      {section === "productos" && <AdminProducts token={token} categories={categories} onChanged={loadOverview} />}
      {section === "categorias" && <AdminCategories token={token} onChanged={loadOverview} />}
      {section === "promociones" && <AdminPromotions token={token} />}
      {section === "negocio" && <form className="admin-editor admin-settings-form" onSubmit={saveBusinessSettings}>
        <div className="admin-editor-heading"><div><p className="admin-overline">INFORMACIÓN PÚBLICA</p><h2>Datos del negocio</h2></div></div>
        <label>WhatsApp de pedidos<input value={settingsDraft.whatsappNumber} onChange={(event) => setSettingsDraft({ ...settingsDraft, whatsappNumber: event.target.value })} inputMode="tel" maxLength="20" required /></label>
        <label>Ubicación<input value={settingsDraft.location} onChange={(event) => setSettingsDraft({ ...settingsDraft, location: event.target.value })} maxLength="120" required /></label>
        <label>Frase de marca<input value={settingsDraft.tagline} onChange={(event) => setSettingsDraft({ ...settingsDraft, tagline: event.target.value })} maxLength="120" /></label>
        <button className="admin-save" disabled={savingSettings}>{savingSettings ? "Guardando..." : "Guardar datos"}</button>
      </form>}
    </section>
  </main>;
}

export default Admin;
