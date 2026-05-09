import React from 'react';
import '../css/Contact.css'

const Contact = () => {
  return (
    <section className="contact-section bg-light py-5">
      <div className="container text-center">
        <h2 className="mb-5">Contáctanos</h2>
        
        <div className="row align-items-start">
          
        
          <div className="col-md-4">
            <i className="bi bi-geo-alt-fill fs-2 text-success"></i>
            <h4 className="mt-3">Nuestra Sede</h4>
            <p><i class="fa-solid fa-street-view"></i> Calle Falsa 123<br />Medellín, Antioquia</p>
          </div>

        
          <div className="col-md-4">
            <i className="bi bi-chat-dots-fill fs-2 text-success"></i>
            <h4 className="mt-3">Redes Sociales</h4>
            <div className="d-flex flex-column align-items-center">
              <a href="#" className="text-decoration-none text-dark mb-1"><i class="fa-brands fa-instagram"></i> Instagram: @PulpasPracticas</a>
              <a href="#" className="text-decoration-none text-dark mb-1"><i class="fa-brands fa-facebook"></i> Facebook: Pulpas Prácticas </a>
              <a href="#" className="text-decoration-none text-success fw-bold"><i class="fa-brands fa-whatsapp"></i> WhatsApp: +57 300 000 0000</a>
            </div>
          </div>

        
          <div className="col-md-4">
            <i className="bi bi-clock-fill fs-2 text-success"></i>
            <h4 className="mt-3">Atención</h4>
            <ul className="list-unstyled">
              <li><strong>Lunes - Viernes:</strong> 8:00 - 17:00</li>
              <li><strong>Sábados:</strong> 9:00 - 13:00</li>
              <li><strong>Domingos:</strong> Solo domicilios programados</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

