import { Router } from 'express';
import nodemailer from 'nodemailer';
import Mail from '../models/Mail.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  pool: true,
  maxConnections: 3,
});

router.post('/send', async (req, res, next) => {
  try {
    const { subject, body, recipients } = req.body || {};
    if (!subject?.trim() || !body?.trim()) {
      return res.status(400).json({ message: 'Subject and email body are required.' });
    }
    const list = [...new Set((recipients || []).map((e) => String(e).trim().toLowerCase()).filter(Boolean))];
    const invalid = list.filter((e) => !EMAIL_RE.test(e));
    if (!list.length) return res.status(400).json({ message: 'Add at least one recipient.' });
    if (invalid.length) return res.status(400).json({ message: `Invalid addresses: ${invalid.slice(0, 5).join(', ')}` });

    const missingConfig = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM']
      .filter((key) => !process.env[key]?.trim());
    const smtpPort = Number(process.env.SMTP_PORT);
    if (missingConfig.length || !Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
      return res.status(503).json({
        message: 'Email sending is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in Vercel.',
      });
    }

    const record = await Mail.create({ subject, body, recipients: list });
    const results = [];

    // Send one-by-one so recipients never see each other's addresses
    for (const email of list) {
      try {
        await transporter.sendMail({ from: process.env.MAIL_FROM, to: email, subject, text: body });
        results.push({ email, ok: true });
        console.log(`sent -> ${email}`);
      } catch (err) {
        results.push({ email, ok: false, error: err.message });
        console.error(`failed -> ${email}: ${err.message}`);
      }
    }

    const sentCount = results.filter((r) => r.ok).length;
    const failedCount = results.length - sentCount;
    record.set({
      results, sentCount, failedCount,
      status: failedCount === 0 ? 'sent' : sentCount === 0 ? 'failed' : 'partial',
    });
    await record.save();

    res.status(failedCount === results.length ? 502 : 200).json({
      message: failedCount === 0
        ? `Sent to all ${sentCount} recipients.`
        : `Sent to ${sentCount}, failed for ${failedCount}.`,
      mail: record,
    });
  } catch (e) { next(e); }
});

router.get('/history', async (_req, res, next) => {
  try {
    res.json(await Mail.find().sort({ createdAt: -1 }).limit(100));
  } catch (e) { next(e); }
});

export default router;
