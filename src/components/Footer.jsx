function Footer() {
  return (
    <>
      <footer className="footer">

        <div className="footer-contenido">

          <div className="footer-col">
            <h3>Pulpas Del Campo</h3>

            <p>
              Somos una empresa dedicada a la producción
              y venta de pulpas 100% naturales.
            </p>
          </div>

          <div className="footer-col">
            <h4>Enlaces</h4>

            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contacto</h4>

            <p>📍 Medellín, Colombia</p>
            <p>📞 300 123 4567</p>
            <p>✉ ventas@pulpas.com</p>
          </div>

        </div>

      </footer>

      <div className="barra-azul">
        <p>© 2026 Pulpas</p>
      </div>
    </>
  );
}

export default Footer;