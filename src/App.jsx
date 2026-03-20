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
  "Voluntariado o colaborar":
    "Cuéntanos en qué te gustaría colaborar y disponibilidad.",
  "Derivación institucional": "Indica la entidad y un teléfono de contacto.",
  Otro: "Describe brevemente tu solicitud.",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [tipoSolicitud, setTipoSolicitud] = useState("");
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
      nombre: formData.get("nombre") || "",
      telefono: formData.get("telefono") || "",
      servicio: formData.get("servicio") || "",
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
            <a href="#solicitud">Solicitar</a>
            <a href="#clases">Clases</a>
            <a href="#colabora">Colabora</a>
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
            <a href="#solicitud" onClick={() => setMenuOpen(false)}>
              Solicitar
            </a>
            <a href="#clases" onClick={() => setMenuOpen(false)}>
              Clases
            </a>
            <a href="#colabora" onClick={() => setMenuOpen(false)}>
              Colabora
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
                <option>Voluntariado o colaborar</option>
                <option>Derivación institucional</option>
                <option>Otro</option>
              </select>
            </label>
            <p className="form-help">{currentHelp}</p>
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

        <section id="colabora" className="section alt">
          <div className="section-header">
            <h2>Colabora con Integra</h2>
            <p>Buscamos voluntariado y apoyo para mantener los servicios gratuitos.</p>
          </div>
          <div className="grid services">
            <article className="card">
              <h3>Voluntariado</h3>
              <p>Personas con perfil social, educativo o administrativo.</p>
              <a className="btn btn-ghost" href="#contacto">
                Quiero ser voluntario
              </a>
            </article>
            <article className="card">
              <h3>Socios y donaciones</h3>
              <p>Tu apoyo mantiene la gratuidad para quienes más lo necesitan.</p>
              <a className="btn btn-ghost" href="#contacto">
                Hacer una aportación
              </a>
            </article>
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
            <p>Horario sugerido: mañana (10:00 - 13:00)</p>
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
