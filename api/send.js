import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.RESEND_TO_EMAIL || "jpecina@gmail.com";
const fromEmail = process.env.RESEND_FROM || "Asociacion Integra <onboarding@resend.dev>";

const resend = new Resend(resendApiKey || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY no configurada." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const {
    formType,
    nombre,
    telefono,
    email,
    documento,
    domicilio,
    pago,
    iban,
    servicio,
    tipoVoluntariado,
    disponibilidad,
    mensaje,
  } = body || {};

  const isMember = formType === "Socios";

  if (isMember) {
    if (!nombre || !telefono || !email || !documento || !domicilio || !pago) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
  } else {
    if (!nombre || !telefono || !servicio) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
  }

  const lines = ["Solicitud de Asociacion Integra"];
  if (formType) {
    lines.push(`Formulario: ${formType}`);
  }
  lines.push(`Nombre: ${nombre}`);
  lines.push(`Telefono: ${telefono}`);
  if (email) lines.push(`Email: ${email}`);
  if (documento) lines.push(`Documento: ${documento}`);
  if (domicilio) lines.push(`Domicilio: ${domicilio}`);
  if (pago) lines.push(`Forma de pago: ${pago}`);
  if (iban) lines.push(`IBAN: ${iban}`);
  if (servicio) lines.push(`Tipo de solicitud: ${servicio}`);
  if (tipoVoluntariado) lines.push(`Tipo de voluntariado: ${tipoVoluntariado}`);
  if (disponibilidad) lines.push(`Disponibilidad: ${disponibilidad}`);
  if (mensaje) lines.push(`Mensaje: ${mensaje}`);

  const text = lines.join("\n");

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: "Solicitud web - Asociacion Integra",
      text,
    });

    if (result.error) {
      return res.status(500).json({ error: result.error.message || "Error enviando email." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "No se pudo enviar el email.";
    console.error("Resend error:", error);
    return res.status(500).json({ error: message });
  }
}
