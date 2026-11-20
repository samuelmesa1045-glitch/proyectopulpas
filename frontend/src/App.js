import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Paquetes from "./pages/Paquetes";
import Quienes from "./pages/Quienes";
import Contacto from "./pages/Contacto";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import Acceso from "./pages/Acceso";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import VerificarCorreo from "./pages/VerificarCorreo";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";

function App() {
  return (
    <AuthProvider>
    <StoreSettingsProvider>
    <CarritoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/quienes" element={<Quienes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/acceso" element={<Acceso />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verificar-correo" element={<VerificarCorreo />} />
      </Routes>
    </BrowserRouter>
    </CarritoProvider>
    </StoreSettingsProvider>
    </AuthProvider>
  );
}

export default App;
