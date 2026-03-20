const form = document.getElementById("citaForm");
const tipoSolicitud = document.getElementById("tipoSolicitud");
const solicitudHelp = document.getElementById("solicitudHelp");
const formStatus = document.getElementById("formStatus");

const helpMessages = {
  "Cita de asesoría": "Describe el trámite o la ayuda que necesitas para preparar la cita.",
  "Inscripción a clases": "Indica tu nivel aproximado (A0, A1, A2) si lo conoces.",
  "Voluntariado o colaborar": "Cuéntanos en qué te gustaría colaborar y disponibilidad.",
  "Derivación institucional": "Indica la entidad y un teléfono de contacto.",
  Otro: "Describe brevemente tu solicitud.",
};

if (tipoSolicitud && solicitudHelp) {
  tipoSolicitud.addEventListener("change", (event) => {
    solicitudHelp.textContent =
      helpMessages[event.target.value] || "Selecciona una opción para ver qué información necesitamos.";
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = true;
    }
    if (formStatus) {
      formStatus.textContent = "Enviando solicitud...";
    }

    const data = new FormData(form);
    const payload = {
      nombre: data.get("nombre") || "",
      telefono: data.get("telefono") || "",
      servicio: data.get("servicio") || "",
      disponibilidad: data.get("disponibilidad") || "",
      mensaje: data.get("mensaje") || "",
    };

    fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "No se pudo enviar la solicitud.");
        }
        return response.json();
      })
      .then(() => {
        form.reset();
        if (formStatus) {
          formStatus.textContent =
            "Solicitud enviada. Te responderemos lo antes posible.";
        }
      })
      .catch(() => {
        if (formStatus) {
          formStatus.textContent =
            "No se pudo enviar la solicitud. Intentalo mas tarde o escribe por WhatsApp.";
        }
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
}

const revealElements = document.querySelectorAll(".section, .hero");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

const heroSlider = document.getElementById("heroSlider");
const sliderImages = [
  "/images/Generated%20Image%20March%2020%2C%202026%20-%203_55PM.png",
  "/images/Generated%20Image%20March%2020%2C%202026%20-%203_57PM.png",
  "/images/Generated%20Image%20March%2020%2C%202026%20-%203_58PM.png",
];

if (heroSlider && sliderImages.length > 0) {
  let currentIndex = 0;
  heroSlider.src = sliderImages[0];

  setInterval(() => {
    heroSlider.classList.add("is-fading");
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % sliderImages.length;
      heroSlider.src = sliderImages[currentIndex];
      heroSlider.classList.remove("is-fading");
    }, 500);
  }, 5000);
}
