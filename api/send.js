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

  const { nombre, telefono, servicio, disponibilidad, mensaje } = body || {};

  if (!nombre || !telefono || !servicio) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const text = [
    "Solicitud de Asociacion Integra",
    `Nombre: ${nombre}`,
    `Telefono: ${telefono}`,
    `Tipo de solicitud: ${servicio}`,
    `Disponibilidad: ${disponibilidad || "-"}`,
    `Mensaje: ${mensaje || "-"}`,
  ].join("\n");

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
    return res.status(500).json({ error: "No se pudo enviar el email." });
  }
}
