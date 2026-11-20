import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { authRequest, resendVerification } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/acceso.css";
import { BRAND_NAME, BRAND_TAGLINE } from "../config/brand";

function Acceso() {
  const [role, setRole] = useState("buyer");
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerType, setCustomerType] = useState("person");
  const [documentType, setDocumentType] = useState("CC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if (session) return <Navigate to={session.user.role === "admin" ? "/admin" : "/"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = registering
        ? await authRequest("register", { name, email, password, customerType, documentType, documentNumber, phone, address, companyName, taxId })
        : await authRequest("login", { email, password, role });
      if (registering) {
        setVerificationPending(true);
        setRegistering(false);
        setVerificationMessage(result.message);
        setVerificationUrl(result.verificationUrl || "");
        return;
      }
      signIn(result);
      navigate(result.user.role === "admin" ? "/admin" : searchParams.get("next") === "checkout" ? "/checkout" : "/");
    } catch (requestError) {
      if (requestError.code === "EMAIL_NOT_VERIFIED") {
        setVerificationPending(true);
        setVerificationMessage(requestError.message);
      } else setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const requestVerification = async (event) => {
    event.preventDefault();
    setResending(true); setResendMessage(""); setError("");
    try {
      const result = await resendVerification(email);
      setResendMessage(result.message);
      setVerificationUrl(result.verificationUrl || "");
    } catch (requestError) { setError(requestError.message); }
    finally { setResending(false); }
  };

  if (verificationPending) return <main className="access-page">
    <Link className="access-brand" to="/"><img src="/images/brand/logo-tropical.png" alt={BRAND_NAME} /><span>{BRAND_TAGLINE}</span></Link>
    <section className="access-layout"><div className="access-intro"><p className="access-eyebrow">UN PASO MÁS</p><h1>Confirma tu correo</h1><p>Activa tu cuenta para comprar en {BRAND_NAME}.</p></div>
      <section className="access-form email-verification-panel"><h2>Revisa tu bandeja de entrada</h2><p>{verificationMessage}</p><p className="verification-email">{email}</p>
        {verificationUrl && <p>En este entorno local puedes <a href={verificationUrl}>confirmar tu correo aquí</a>.</p>}
        <form onSubmit={requestVerification}><label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><button className="access-submit" disabled={resending}>{resending ? "Enviando..." : "Reenviar enlace"}</button></form>
        {resendMessage && <p role="status" className="verification-status">{resendMessage}</p>}{error && <p className="access-error" role="alert">{error}</p>}
        <button className="access-home" type="button" onClick={() => { setVerificationPending(false); setVerificationUrl(""); setError(""); }}>Volver a iniciar sesión</button>
      </section>
    </section>
  </main>;

  return (
    <main className="access-page">
      <Link className="access-brand" to="/"><img src="/images/brand/logo-tropical.png" alt={BRAND_NAME} /><span>{BRAND_TAGLINE}</span></Link>
      <section className="access-layout">
        <div className="access-intro">
          <p className="access-eyebrow">JULIT-REX · PULPAS 100% NATURALES</p>
          <h1>{registering ? "Crea tu cuenta" : role === "admin" ? "Panel de gestión" : "Qué bueno verte"}</h1>
          <p>Entra para continuar con tu experiencia en {BRAND_NAME}.</p>
        </div>
        <form className="access-form" onSubmit={submit}>
          <div className="access-tabs" role="tablist" aria-label="Tipo de acceso">
            <button type="button" className={role === "buyer" ? "selected" : ""} onClick={() => { setRole("buyer"); setRegistering(false); setError(""); }}>Comprador</button>
            <button type="button" className={role === "admin" ? "selected" : ""} onClick={() => { setRole("admin"); setRegistering(false); setError(""); }}>Administrador</button>
          </div>
          <h2>{registering ? "Regístrate" : "Iniciar sesión"}</h2>
          {registering && <>
            <div className="customer-type" aria-label="Tipo de cliente">
              <button type="button" className={customerType === "person" ? "selected" : ""} onClick={() => setCustomerType("person")}>Persona</button>
              <button type="button" className={customerType === "company" ? "selected" : ""} onClick={() => setCustomerType("company")}>Empresa</button>
            </div>
            <label>{customerType === "company" ? "Nombre de contacto" : "Nombre completo"}<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength="80" /></label>
            {customerType === "company" && <>
              <label>Razón social<input value={companyName} onChange={(event) => setCompanyName(event.target.value)} required /></label>
              <label>NIT<input inputMode="numeric" value={taxId} onChange={(event) => setTaxId(event.target.value)} required /></label>
            </>}
            <div className="access-row">
              <label>Tipo de documento<select value={documentType} onChange={(event) => setDocumentType(event.target.value)}><option value="CC">Cédula</option><option value="CE">Cédula de extranjería</option><option value="Pasaporte">Pasaporte</option><option value="NIT">NIT</option></select></label>
              <label>Número<input inputMode="numeric" value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} required /></label>
            </div>
            <label>Teléfono<input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
            <label>Dirección de entrega<input autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} required /></label>
          </>}
          <label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Contraseña<input type="password" autoComplete={registering ? "new-password" : "current-password"} minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p className="access-error" role="alert">{error}</p>}
          <button className="access-submit" disabled={busy}>{busy ? registering ? "Creando cuenta..." : "Ingresando..." : registering ? "Crear cuenta" : "Entrar"}</button>
          {role === "buyer" && <p className="access-switch">{registering ? "¿Ya tienes cuenta?" : "¿Primera vez por aquí?"} <button type="button" onClick={() => { setRegistering(!registering); setError(""); }}>{registering ? "Inicia sesión" : "Regístrate"}</button></p>}
          <Link className="access-home" to="/">Volver a la tienda</Link>
        </form>
      </section>
    </main>
  );
}

export default Acceso;
