import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import { BRAND_NAME } from "../config/brand";
import { formatWhatsapp, useStoreSettings } from "../context/StoreSettingsContext";

const Footer = () => {
  const { settings } = useStoreSettings();
  const phone = formatWhatsapp(settings.whatsappNumber);
  return <footer className="footer-pulpas">
    <div className="footer-container">
      <div className="footer-section footer-brand">
        <Link to="/" aria-label={`${BRAND_NAME}, inicio`}>
          <img src="/images/brand/logo-tropical.png" alt={BRAND_NAME} />
        </Link>
        <p>{settings.tagline} ¡Más que pulpas, una aventura frutal!</p>
      </div>
      <div className="footer-section">
        <h4>Explora</h4>
        <ul>
          <li><Link to="/productos">Nuestras pulpas</Link></li>
          <li><Link to="/paquetes">Paquetes tropicales</Link></li>
          <li><Link to="/quienes">Conócenos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Hablemos</h4>
        <p>{settings.location}</p>
        <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp: {phone}</a>
        <p className="footer-email-note">Atención y pedidos por WhatsApp</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.</p>
    </div>
  </footer>;
};

export default Footer;
