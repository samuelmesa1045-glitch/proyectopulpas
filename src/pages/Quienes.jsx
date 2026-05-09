import React from 'react';
import '../styles/Quienes.css';
import '../components/Navbar'
import '../components/Navbar'

const Quienes = () => {
  return (
    <section className="quienes-section py-5">
      <div className="container">
        
        {/* Encabezado de la Sección */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5">¿Quiénes Somos?</h1>
          <p className="quienes-descripcion mx-auto mt-3">
            En <strong>Pulpas Prácticas</strong> nos dedicamos a ofrecer pulpas de fruta 100% naturales, 
            frescas y listas para preparar tus bebidas favoritas de manera rápida y saludable.
          </p>
        </div>

        {/* Grid de Información con Bootstrap */}
        <div className="row g-4 text-center">
          
          {/* Tarjeta 1: Calidad */}
          <div className="col-md-4">
            <div className="quienes-card p-4 h-100 shadow-sm">
              <div className="quienes-icon mb-3">
                <i className="fa-solid fa-leaf text-success"></i>
              </div>
              <h3>Calidad Natural</h3>
              <p>Seleccionamos frutas frescas para garantizar sabor auténtico y nutrición en cada pulpa.</p>
            </div>
          </div>

          {/* Tarjeta 2: Compromiso */}
          <div className="col-md-4">
            <div className="quienes-card p-4 h-100 shadow-sm">
              <div className="quienes-icon mb-3">
                <i className="fa-solid fa-heart text-danger"></i>
              </div>
              <h3>Compromiso</h3>
              <p>Trabajamos con pasión para llevar productos saludables a cada hogar y emprendimiento.</p>
            </div>
          </div>

          {/* Tarjeta 3: Distribución */}
          <div className="col-md-4">
            <div className="quienes-card p-4 h-100 shadow-sm">
              <div className="quienes-icon mb-3">
                <i className="fa-solid fa-truck text-primary"></i>
              </div>
              <h3>Distribución</h3>
              <p>Ofrecemos paquetes y ventas al por mayor para negocios y familias.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Quienes;