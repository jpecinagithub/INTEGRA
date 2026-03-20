import "dotenv/config";
import express from "express";
import { Resend } from "resend";

const app = express();
const port = process.env.PORT || 3000;

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.RESEND_TO_EMAIL || "jpecina@gmail.com";
const fromEmail = process.env.RESEND_FROM || "Asociacion Integra <onboarding@resend.dev>";

if (!resendApiKey) {
  console.warn("RESEND_API_KEY is not set. Email sending will fail until configured.");
}

const resend = new Resend(resendApiKey || "");

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));
app.use(express.static("."));

app.post("/api/send", async (req, res) => {
  const { nombre, telefono, servicio, disponibilidad, mensaje } = req.body || {};

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

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo enviar el email." });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
