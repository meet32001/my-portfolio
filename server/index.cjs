process.env.DOTENV_DISABLE_TIPS = 'true';
require('dotenv').config({ DOTENV_KEY: '', override: true });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

process.on('uncaughtException', e => console.error('UncaughtException:', e));
process.on('unhandledRejection', e => console.error('UnhandledRejection:', e));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Contact form endpoint (email only)
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, website, phone, email, subject, message, company, _honeypot } = req.body || {};

    // Honeypot spam check: if hidden fields are filled, pretend success but skip sending
    if ((typeof company === 'string' && company.trim()) || (typeof _honeypot === 'string' && _honeypot.trim())) {
      return res.json({ ok: true });
    }

    // Basic validation
    if (!fullName || !email || !subject || !message) {
      return res.status(422).json({ error: "Missing required fields" });
    }

    // SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Email body
    const html = `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Website:</strong> ${website || "-"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
    `;

    const text =
      `New Contact Submission\n\n` +
      `Name: ${fullName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || '-'}\n` +
      `Website: ${website || '-'}\n` +
      `Subject: ${subject}\n` +
      `Message:\n${String(message)}\n`;

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Contact: ${subject} — ${fullName}`,
      replyTo: email,
      text,
      html,
    });
    
    res.json({ ok: true });

    // Optional: send acknowledgment email to the sender
    try {
      if (email && /.+@.+\..+/.test(email)) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Thanks for reaching out, ${fullName}!`,
          text: `Hi ${fullName},\n\nThanks for contacting me. I received your message and will get back to you soon.\n\n— ${process.env.EMAIL_FROM}`,
          html: `<p>Hi ${fullName},</p><p>Thanks for contacting me. I received your message and will get back to you soon.</p><p>— ${process.env.EMAIL_FROM}</p>`,
        });
      }
    } catch (ackErr) {
      console.error("ack email error:", ackErr && (ackErr.message || ackErr));
      // Do not fail the request if the acknowledgment fails
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));