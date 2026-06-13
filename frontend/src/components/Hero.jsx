import { useEffect, useState } from "react";
import "../styles/hero.css"

const images = [
"https://images.pexels.com/photos/8215113/pexels-photo-8215113.jpeg",

  "https://images.pexels.com/photos/30740199/pexels-photo-30740199.jpeg",

  "https://images.pexels.com/photos/16724961/pexels-photo-16724961.jpeg"
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setToggle((prev) => !prev);

      setIndex((prev) => (prev + 1) % images.length);
      setNextIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">

      {/* capa 1 */}
      <div
        className={`hero-bg bg-1 ${toggle ? "hidden" : ""}`}
        style={{ backgroundImage: `url(${images[index]})` }}
      />

      {/* capa 2 */}
      <div
        className={`hero-bg bg-2 ${toggle ? "active" : ""}`}
        style={{ backgroundImage: `url(${images[nextIndex]})` }}
      />

      {/* overlay */}
      <div className="hero-overlay" />

      {/* texto */}
      <div className="hero-text">
        <h1>PULPAS 100% NATURALES</h1>
        <p>   Disfruta el sabor real de la fruta fresca,
          sin conservantes y listas para preparar
          tus jugos favoritos.</p>
        <a href="#productos" className="btn-hero">
          Ver productos
        </a>
      </div>

    </section>
  );
};

export default Hero;