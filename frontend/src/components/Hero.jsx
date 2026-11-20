import { Link } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero" aria-label="JuliT-REX, pulpas naturales">
      <img
        className="hero-art"
        src="/images/brand/banner-brand.png"
        alt="JuliT-REX, aventura frutal con pulpas naturales y frutas tropicales"
      />
      <div className="hero-actions">
        <Link to="/productos" className="btn-hero">Explorar pulpas</Link>
      </div>
    </section>
  );
}

export default Hero;
