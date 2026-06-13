import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Paquetes from "./pages/Paquetes";
import Quienes from "./pages/Quienes";
import Contacto from "./pages/Contacto";
import { CarritoProvider } from "./context/CarritoContext";

function App() {
  return (
    <CarritoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/quienes" element={<Quienes />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;