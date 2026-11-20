import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/api";
import { BRAND_NAME, BRAND_TAGLINE } from "../config/brand";
import "../styles/acceso.css";

function VerificarCorreo() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState({ loading: true, success: false, message: "Confirmando tu correo..." });

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setState({ loading: false, success: false, message: "El enlace de confirmación no contiene un código válido." });
      return () => { mounted = false; };
    }
    verifyEmail(token)
      .then((result) => { if (mounted) setState({ loading: false, success: true, message: result.message }); })
      .catch((error) => { if (mounted) setState({ loading: false, success: false, message: error.message }); });
    return () => { mounted = false; };
  }, [token]);

  return <main className="access-page"><Link className="access-brand" to="/"><img src="/images/brand/logo-tropical.png" alt={BRAND_NAME} /><span>{BRAND_TAGLINE}</span></Link>
    <section className="email-verification-card"><p className="access-eyebrow">JULIT-REX</p><h1>{state.loading ? "Un momento" : state.success ? "¡Correo confirmado!" : "No pudimos confirmar"}</h1><p role={state.success ? "status" : "alert"}>{state.message}</p>
      <Link className="access-submit verification-link" to="/acceso">{state.success ? "Iniciar sesión" : "Volver al acceso"}</Link>
    </section>
  </main>;
}
export default VerificarCorreo;
