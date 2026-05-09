import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categorias from "../components/Categorias";
import ProductosDestacados from "../components/ProductosDestacados";
import Footer from "../components/Footer";

function Home() {

  return (
    <>
      <Navbar />

      <Hero />

      <Categorias />

      <ProductosDestacados />

      <Footer />
    </>
  );
}

export default Home;