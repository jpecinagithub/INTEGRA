import { useEffect, useMemo, useState } from "react";
import "./App.css";

const sliderImages = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

const helpMessages = {
  "Cita de asesoría":
    "Describe el trámite o la ayuda que necesitas para preparar la cita.",
  "Inscripción a clases":
    "Indica tu nivel aproximado (A0, A1, A2) si lo conoces.",
  "Búsqueda de empleo":
    "Cuéntanos tu experiencia, tipo de trabajo y disponibilidad.",
  Voluntariado:
    "Cuéntanos en qué te gustaría colaborar y disponibilidad.",
  "Derivación institucional": "Indica la entidad y un teléfono de contacto.",
  Otro: "Describe brevemente tu solicitud.",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [tipoVoluntariado, setTipoVoluntariado] = useState("");
  const [memberPaymentMethod, setMemberPaymentMethod] = useState("");
  const [memberStatus, setMemberStatus] = useState("");
  const [memberSending, setMemberSending] = useState(false);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const currentHelp = useMemo(
    () =>
      helpMessages[tipoSolicitud] ||
      "Selecciona una opción para ver qué información necesitamos.",
    [tipoSolicitud]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("Enviando solicitud...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      formType: "Solicitud general",
      nombre: formData.get("nombre") || "",
      telefono: formData.get("telefono") || "",
      servicio: formData.get("servicio") || "",
      tipoVoluntariado: formData.get("tipoVoluntariado") || "",
      disponibilidad: formData.get("disponibilidad") || "",
      mensaje: formData.get("mensaje") || "",
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      form.reset();
      setTipoSolicitud("");
      setTipoVoluntariado("");
      setStatus("Solicitud enviada. Te responderemos lo antes posible.");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "No se pudo enviar la solicitud. Inténtalo más tarde o escribe por WhatsApp.";
      setStatus(message);
    } finally {
      setSending(false);
    }
  };

  const handleMemberSubmit = async (event) => {
    event.preventDefault();
    setMemberSending(true);
    setMemberStatus("Enviando solicitud de socio...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      formType: "Socios",
      nombre: formData.get("memberNombre") || "",
      telefono: formData.get("memberTelefono") || "",
      email: formData.get("memberEmail") || "",
      documento: formData.get("memberDocumento") || "",
      domicilio: formData.get("memberDomicilio") || "",
      pago: formData.get("memberPago") || "",
      iban: formData.get("memberIban") || "",
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      form.reset();
      setMemberPaymentMethod("");
      setMemberStatus("Solicitud de socio enviada. Te contactaremos pronto.");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "No se pudo enviar la solicitud. Inténtalo más tarde.";
      setMemberStatus(message);
    } finally {
      setMemberSending(false);
    }
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="nav">
          <div className="logo">
            <span className="logo-mark">INTEGRA</span>
            <span className="logo-sub">Asociación</span>
          </div>
          <nav className="nav-links">
            <a href="#ayuda">Ayuda</a>
            <a href="#clases">Clases</a>
            <a href="#voluntariado">Voluntariado</a>
            <a href="#socios">Socios</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
          >
            Menú
          </button>
          <a className="btn btn-ghost" href="#solicitud">
            Solicitar
          </a>
        </div>
        {menuOpen && (
          <div className="mobile-menu" id="mobileMenu">
            <a href="#ayuda" onClick={() => setMenuOpen(false)}>
              Ayuda
            </a>
            <a href="#clases" onClick={() => setMenuOpen(false)}>
              Clases
            </a>
            <a href="#voluntariado" onClick={() => setMenuOpen(false)}>
              Voluntariado
            </a>
            <a href="#socios" onClick={() => setMenuOpen(false)}>
              Socios
            </a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Logroño · La Rioja</p>
            <h1>Apoyo cercano y gratuito para personas inmigrantes.</h1>
            <p className="lead">
              Orientamos en trámites con la Administración Pública, clases de español,
              empleo y recursos sociales.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#solicitud">
                Pedir ayuda
              </a>
              <a className="btn btn-outline" href="#clases">
                Clases de español
              </a>
              <a className="btn btn-ghost" href="https://wa.me/34624610941">
                WhatsApp 624 61 09 41
              </a>
            </div>
            <p className="note">Atención presencial solo con cita previa.</p>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <img src={sliderImages[currentImage]} alt="Servicios de Integra" />
              <div className="hero-frame-caption">Servicios de la Asociación Integra</div>
            </div>
          </div>
        </section>

        <section id="ayuda" className="section">
          <div className="section-header">
            <h2>Ayuda principal</h2>
            <p>Orientación clara y acompañamiento práctico para cada trámite.</p>
          </div>
          <div className="grid services">
            <article className="card">
              <h3>Trámites administrativos</h3>
              <p>
                Regularización, reagrupación familiar, carta de invitación,
                nacionalidad, citas previas y certificado digital.
              </p>
            </article>
            <article className="card">
              <h3>Salud y ayudas</h3>
              <p>Tarjeta sanitaria o DASE, ayudas y subvenciones, orientación social.</p>
            </article>
            <article className="card">
              <h3>Empleo</h3>
              <p>Currículum, entrevistas y búsqueda activa con seguimiento.</p>
            </article>
            <article className="card">
              <h3>Recursos y derivaciones</h3>
              <p>Información de otras asociaciones, ONG e instituciones.</p>
            </article>
          </div>
          <p className="note">
            También facilitamos información de otras asociaciones y grupos de WhatsApp por área de interés.
          </p>
        </section>

        <section id="clases" className="section alt">
          <div className="section-header">
            <h2>Clases de español</h2>
            <p>En verano seguimos abiertos. El idioma es clave para la integración.</p>
          </div>
          <ul className="list">
            <li>
              <strong>Horario:</strong> lunes a viernes, 10:00 a 11:00.
            </li>
            <li>
              <strong>Inicio:</strong> 1 de julio de 2026 (matrícula y nivelación).
            </li>
            <li>
              <strong>Niveles:</strong> A0 (lunes y jueves), A1 (martes y viernes),
              A2 (miércoles).
            </li>
            <li>
              <strong>Requisitos:</strong> NIE o pasaporte.
            </li>
            <li>
              <strong>Certificados:</strong> disponibles para instituciones derivadoras.
            </li>
          </ul>
          <a className="btn btn-outline" href="#solicitud">
            Inscribirme a clases
          </a>
        </section>

        <section id="solicitud" className="section">
          <div className="section-header">
            <h2>Solicitud</h2>
            <p>Indica claramente el tipo de solicitud para agilizar la respuesta.</p>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Tipo de solicitud
              <select
                name="servicio"
                value={tipoSolicitud}
                onChange={(event) => setTipoSolicitud(event.target.value)}
                required
              >
                <option value="">Selecciona</option>
                <option>Cita de asesoría</option>
                <option>Inscripción a clases</option>
                <option>Búsqueda de empleo</option>
                <option>Voluntariado</option>
                <option>Derivación institucional</option>
                <option>Otro</option>
              </select>
            </label>
            <p className="form-help">{currentHelp}</p>
            {tipoSolicitud === "Voluntariado" && (
              <label>
                Tipo de voluntariado
                <select
                  name="tipoVoluntariado"
                  value={tipoVoluntariado}
                  onChange={(event) => setTipoVoluntariado(event.target.value)}
                  required
                >
                  <option value="">Selecciona</option>
                  <option>Acompañamiento en gestiones administrativas</option>
                  <option>Clases de español</option>
                  <option>Orientación para el empleo</option>
                </select>
              </label>
            )}
            <label>
              Nombre y apellidos
              <input type="text" name="nombre" placeholder="Tu nombre" required />
            </label>
            <label>
              Teléfono (WhatsApp)
              <input type="tel" name="telefono" placeholder="+34 6XX XXX XXX" required />
            </label>
            <label>
              Disponibilidad
              <input
                type="text"
                name="disponibilidad"
                placeholder="Días y horarios preferidos"
              />
            </label>
            <label>
              Mensaje breve
              <textarea name="mensaje" rows="4" placeholder="Cuéntanos tu caso" />
            </label>
            <label className="checkbox">
              <input type="checkbox" required />
              Acepto la política de privacidad y el tratamiento de datos para gestionar la solicitud.
            </label>
            <button className="btn btn-primary" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar solicitud"}
            </button>
            {status && <p className="form-status">{status}</p>}
          </form>
        </section>

        <section id="voluntariado" className="section alt">
          <div className="section-header">
            <h2>Voluntariado</h2>
            <p>Personas con perfil social, educativo o administrativo.</p>
          </div>
          <div className="grid services">
            <article className="card">
              <h3>Voluntariado</h3>
              <p>Acompañamiento en gestiones, clases de español u orientación laboral.</p>
              <a className="btn btn-ghost" href="#solicitud">
                Quiero ser voluntario
              </a>
            </article>
          </div>
        </section>

        <section id="socios" className="section">
          <div className="section-header">
            <h2>Socios</h2>
            <p>Cuota solidaria para sostener la atención gratuita.</p>
          </div>
          <div className="split">
            <div>
              <ul className="list">
                <li>
                  <strong>Servicios adicionales para socios:</strong> tramitación de
                  expedientes de extranjería (regularización, reagrupación familiar,
                  permisos de residencia y trabajo, cartas de invitación, solicitud de
                  nacionalidad, preparación DELE y CCSE, gestión de ayudas y subvenciones, etc.).
                </li>
                <li>
                  <strong>Usuarios:</strong> orientación y acompañamiento en gestiones.
                </li>
                <li>
                  <strong>Socios:</strong> gestión de trámites tras representación firmada.
                </li>
                <li>
                  <strong>Cuota:</strong> 8,5 € al mes.
                </li>
                <li>
                  <strong>Abono en sede (sin cuenta bancaria):</strong> 20 € cada 4 meses.
                </li>
                <li>
                  <strong>Nota:</strong> no hay precios por servicio, solo la cuota.
                </li>
              </ul>
            </div>
            <form className="form" onSubmit={handleMemberSubmit}>
              <label>
                Nombre y apellidos
                <input type="text" name="memberNombre" required />
              </label>
              <label>
                DNI / NIE / Pasaporte
                <input type="text" name="memberDocumento" required />
              </label>
              <label>
                Domicilio
                <input type="text" name="memberDomicilio" required />
              </label>
              <label>
                Teléfono
                <input type="tel" name="memberTelefono" required />
              </label>
              <label>
                Email
                <input type="email" name="memberEmail" required />
              </label>
              <label>
                Forma de pago
                <select
                  name="memberPago"
                  value={memberPaymentMethod}
                  onChange={(event) => setMemberPaymentMethod(event.target.value)}
                  required
                >
                  <option value="">Selecciona</option>
                  <option>Domiciliación bancaria (8,5 €/mes)</option>
                  <option>Abono en sede (20 € cada 4 meses)</option>
                </select>
              </label>
              <p className="form-help">
                El abono en sede está pensado para personas sin cuenta bancaria.
              </p>
              {memberPaymentMethod === "Domiciliación bancaria (8,5 €/mes)" && (
                <label>
                  Datos bancarios (IBAN)
                  <input type="text" name="memberIban" required />
                </label>
              )}
              <label className="checkbox">
                <input type="checkbox" required />
                Acepto el tratamiento de datos para gestionar el alta de socio.
              </label>
              <button className="btn btn-primary" type="submit" disabled={memberSending}>
                {memberSending ? "Enviando..." : "Solicitar alta de socio"}
              </button>
              {memberStatus && <p className="form-status">{memberStatus}</p>}
            </form>
          </div>
        </section>


        <section id="contacto" className="section">
          <div className="section-header">
            <h2>Contacto</h2>
            <p>Estamos en Logroño. Sede provisional con cita previa.</p>
          </div>
          <div className="contact-card">
            <h3>Asociación Integra</h3>
            <p>c/ La Ribera, 3 · 1ºA · Logroño</p>
            <p>WhatsApp: 624 61 09 41</p>
            <p>Email: integralarioja@gmail.com</p>
            <p>Horario sugerido: mañana (11:15 - 13:45)</p>
            <a className="btn btn-outline" href="https://wa.me/34624610941">
              Abrir WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <h4>Asociación Integra</h4>
            <p>Apoyo a personas inmigrantes, mayores y en situación de vulnerabilidad.</p>
          </div>
          <div>
            <h4>Servicios</h4>
            <p>Trámites · Clases · Empleo · Salud · Recursos</p>
          </div>
          <div>
            <h4>Imágenes</h4>
            <p>Imágenes generadas para la asociación.</p>
          </div>
        </div>
        <p className="footer-note">© 2026 Asociación Integra · Atención presencial con cita previa.</p>
      </footer>

      <a className="whatsapp-fab" href="https://wa.me/34624610941">
        WhatsApp
      </a>
    </div>
  );
}

export default App;
