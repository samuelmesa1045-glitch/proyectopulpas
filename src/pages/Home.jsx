import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categorias from "../components/Categorias";
import ProductosDestacados from "../components/ProductosDestacados";
import Carrito from "../components/Carrito";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categorias />
      <ProductosDestacados />
      <Carrito />
      <Footer />
    </>
  );
}

export default Home;