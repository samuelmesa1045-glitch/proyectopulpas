import React from 'react';
import '../styles/Quienes.css';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import { BRAND_NAME, BRAND_TAGLINE } from '../config/brand';

const Quienes = () => {
  return (
    <>
    <Navbar/>
    <section className="quienes-section py-5">
      
      <div className="container">
        
        {/* Encabezado de la Sección */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5">¿Quiénes Somos?</h1>
          <p className="quienes-descripcion mx-auto mt-3">
            En <strong>{BRAND_NAME}</strong> celebramos el sabor de la fruta en cada pulpa, ricas y listas para disfrutar. {BRAND_TAGLINE} para acompañar tus recetas y momentos favoritos.
          </p>
        <img className="quienes-ilustracion" src="/images/brand/institutional-art.png" alt="Ilustración tropical de JuliT-REX y sus pulpas de fruta" />
        <img className="quienes-mascota" src="/images/brand/mascot-trex.png" alt="Mascota oficial de JuliT-REX" />
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
              <p>Trabajamos para conservar el sabor natural de cada fruta en una pulpa fácil de preparar.</p>
            </div>
          </div>

          {/* Tarjeta 2: Compromiso */}
          <div className="col-md-4">
            <div className="quienes-card p-4 h-100 shadow-sm">
              <div className="quienes-icon mb-3">
                <i className="fa-solid fa-heart text-danger"></i>
              </div>
              <h3>Compromiso</h3>
              <p>Queremos que preparar algo rico con fruta sea sencillo para hogares y emprendimientos.</p>
            </div>
          </div>

          {/* Tarjeta 3: Distribución */}
          <div className="col-md-4">
            <div className="quienes-card p-4 h-100 shadow-sm">
              <div className="quienes-icon mb-3">
                <i className="fa-solid fa-truck text-primary"></i>
              </div>
              <h3>Distribución</h3>
              <p>Encuentra sabores para disfrutar en casa y paquetes para compartir.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Quienes;
