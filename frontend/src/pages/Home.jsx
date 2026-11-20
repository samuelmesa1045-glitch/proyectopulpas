import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categorias from "../components/Categorias";
import ProductosDestacados from "../components/ProductosDestacados";
import Footer from "../components/Footer";
import HomeWelcome from "../components/HomeWelcome";
import Promociones from "../components/Promociones";
import "../styles/home-welcome.css";

function Home() {

  return (
    <>
      <Navbar />

      <Hero />

      <HomeWelcome />

      <Promociones />

      <ProductosDestacados />

      <Categorias />

      <Footer />
    </>
  );
}

export default Home;
