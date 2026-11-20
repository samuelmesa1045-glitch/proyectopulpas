import { Link } from "react-router-dom";

function HomeWelcome() {
  return (
    <section className="home-welcome">
      <img src="/images/brand/mascot-welcome.png" alt="Mascota JuliT-REX te da la bienvenida" />
      <div>
        <p className="home-welcome-eyebrow">¡Qué bueno tenerte aquí!</p>
        <h1>Una aventura frutal empieza con JuliT-REX</h1>
        <p>Pulpas naturales para darle más sabor a tus recetas y momentos favoritos.</p>
        <Link to="/productos">Descubrir sabores</Link>
      </div>
    </section>
  );
}

export default HomeWelcome;
