import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-pulpas">
      <div className="footer-container">
        
        {/* Columna 1: Nombre de la Marca */}
        <div className="footer-section">
          <h3>Pulpas Prácticas</h3>
          <p>Sabor natural en tu mesa.</p>
        </div>

        {/* Columna 2: Horarios */}
        <div className="footer-section">
          <h4>Horarios de Atención</h4>
          <ul>
            <li>Lunes a Viernes: 8:00 AM - 5:00 PM</li>
            <li>Sábados: Cerrado</li>
            <li>Domingos: Cerrado</li>
          </ul>
        </div>

        {/* Columna 3: Ubicación y Contacto */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Dirección: Parque Sacudete, Santa Rosa De Osos</p>
          <p><i class="fa-solid fa-phone"></i> Teléfono: +57 300 000 0000</p>
          <p><i class="fa-solid fa-at"></i> Email: info@pulpaspracticas.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Pulpas Prácticas - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;