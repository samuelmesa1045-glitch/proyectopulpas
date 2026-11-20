import { Navigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/acceso.css";
import { BRAND_NAME } from "../config/brand";
import { useStoreSettings } from "../context/StoreSettingsContext";

function Checkout() {
  const { session } = useAuth();
  const { settings } = useStoreSettings();
  const { carrito, total, refreshCartFromCatalog } = useContext(CarritoContext);
  const [requiresInvoice, setRequiresInvoice] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [cartNotice, setCartNotice] = useState("");
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!session || session.user.role === "admin" || !carrito.length) {
      setCheckingCart(false);
      return () => { mounted = false; };
    }
    refreshCartFromCatalog()
      .then((unavailable) => {
        if (mounted && unavailable.length) setCartNotice(`${unavailable.join(", ")} ya no está disponible y se retiró del carrito.`);
      })
      .catch(() => {
        if (mounted) setCartError("No pudimos verificar los precios actuales. Intenta de nuevo antes de enviar el pedido.");
      })
      .finally(() => { if (mounted) setCheckingCart(false); });
    return () => { mounted = false; };
  }, [session, carrito.length, refreshCartFromCatalog]);

  if (!session) return <Navigate to="/acceso?next=checkout" replace />;
  if (session.user.role === "admin") return <Navigate to="/admin" replace />;
  if (!carrito.length) return <><Navbar /><main className="checkout-page"><h1>Tu carrito está vacío</h1><Link to="/productos">Volver al catálogo</Link></main><Footer /></>;

  const enviarPedido = () => {
    const profile = session.user;
    const rows = carrito.map((item) => `• ${item.nombre} x ${item.cantidad}: $${(item.precio * item.cantidad).toLocaleString("es-CO")}`);
    const customer = profile.customerType === "company" ? `Empresa: ${profile.companyName} | NIT: ${profile.taxId}` : `Cliente: ${profile.name} | ${profile.documentType} ${profile.documentNumber}`;
    const invoiceDetails = requiresInvoice
      ? [`Factura electrónica solicitada: SÍ`, `Correo para la factura: ${profile.email}`]
      : ["Factura electrónica solicitada: NO"];
    const message = [`Hola, ${BRAND_NAME}. Quiero realizar este pedido:`, ...rows, `Total: $${total.toLocaleString("es-CO")}`, customer, `Correo: ${profile.email}`, `Teléfono: ${profile.phone}`, `Dirección de entrega: ${profile.address}`, ...invoiceDetails].join("\n");
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <><Navbar /><main className="checkout-page"><p className="access-eyebrow">FINALIZAR COMPRA</p><h1>Revisa tu pedido</h1>
    <section className="checkout-summary"><div className="checkout-lines">{carrito.map((item, index) => <div className="checkout-line" key={`${item.id || item.nombre}-${index}`}><span>{item.nombre} <small>× {item.cantidad}</small></span><strong>${(item.precio * item.cantidad).toLocaleString("es-CO")}</strong></div>)}</div>
      <div className="checkout-total"><span>Total del pedido</span><strong>${total.toLocaleString("es-CO")}</strong></div>
      <div className="checkout-customer"><strong>Entrega para</strong><span>{session.user.customerType === "company" ? session.user.companyName : session.user.name}</span><span>{session.user.phone}</span><span>{session.user.address}</span></div>
      <label className="invoice-request"><input type="checkbox" checked={requiresInvoice} onChange={(event) => setRequiresInvoice(event.target.checked)} /><span><strong>Requiero factura electrónica</strong><small>La solicitud se enviará junto con el pedido para gestionarla al correo {session.user.email}.</small></span></label>
      {cartNotice && <p className="checkout-notice" role="status">{cartNotice}</p>}
      {cartError && <p className="access-error" role="alert">{cartError}</p>}
      <button className="access-submit" onClick={enviarPedido} disabled={checkingCart || Boolean(cartError)}>{checkingCart ? "Verificando precios..." : "Enviar pedido por WhatsApp"}</button><Link className="access-home" to="/productos">Seguir comprando</Link>
    </section>
  </main><Footer /></>;
}

export default Checkout;
