import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BRAND_NAME } from "../config/brand";
import { formatWhatsapp, useStoreSettings } from "../context/StoreSettingsContext";
import "../styles/Contact.css";

function Contacto() {
  const { settings } = useStoreSettings();
  const phone = formatWhatsapp(settings.whatsappNumber);
  return <>
    <Navbar />
    <main className="contact-page">
      <section className="contact-heading">
        <p className="access-eyebrow">ESTAMOS PARA AYUDARTE</p>
        <h1>Hablemos de fruta</h1>
        <p>¿Tienes una pregunta sobre nuestras pulpas o quieres hacer un pedido? Escríbenos.</p>
      </section>
      <section className="contact-grid">
        <article className="contact-column">
          <span className="contact-icon" aria-hidden="true">⌖</span>
          <h2>Desde Santa Rosa</h2>
          <p>{settings.location}</p>
        </article>
        <article className="contact-column">
          <span className="contact-icon" aria-hidden="true">↗</span>
          <h2>Pedidos y consultas</h2>
          <p>Atención directa con {BRAND_NAME}.</p>
          <a className="contact-cta" href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp {phone}</a>
        </article>
        <article className="contact-column">
          <span className="contact-icon" aria-hidden="true">◷</span>
          <h2>Compra en línea</h2>
          <p>Explora el catálogo y envíanos tu pedido desde la tienda.</p>
          <a className="contact-cta contact-cta-light" href="/productos">Ver productos</a>
        </article>
      </section>
    </main>
    <Footer />
  </>;
}

export default Contacto;
