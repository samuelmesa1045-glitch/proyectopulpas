function Categorias() {
  return (
    <section className="categorias">

      <div className="categoria">
        <img
          src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
          alt=""
        />

        <h2>Pulpas de Fruta</h2>

        <a href="/productos" className="btn-categoria">
          Ver Productos
        </a>
      </div>

      <div className="categoria">
        <img
          src="https://images.unsplash.com/photo-1497534446932-c925b458314e"
          alt=""
        />

        <h2>Combos Familiares</h2>

        <a href="/paquetes" className="btn-categoria">
          Comprar Ahora
        </a>
      </div>

    </section>
  );
}

export default Categorias;