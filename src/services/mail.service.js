import nodemailer from 'nodemailer'
import { logger } from '../logger.js'

let transporter

export async function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
    return transporter
  }

  const testAccount = await nodemailer.createTestAccount()
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  })
  logger.info({ user: testAccount.user }, 'Ethereal test SMTP account created')
  return transporter
}

export async function sendVerificationEmail(to, link) {
  const t = await getTransporter()
  const info = await t.sendMail({
    from: '"USOF" <no-reply@usof.dev>',
    to,
    subject: 'Verify your email',
    text: `Click to verify: ${link}`,
    html: `<p>Click to verify: <a href="${link}">${link}</a></p>`
  })
  const preview = nodemailer.getTestMessageUrl(info)
  if (preview) logger.info({ preview }, 'Ethereal preview URL (verify)')
  return { messageId: info.messageId, preview }
}

export async function sendResetEmail(to, link) {
  const t = await getTransporter()
  const info = await t.sendMail({
    from: '"USOF" <no-reply@usof.dev>',
    to,
    subject: 'Password reset',
    text: `Reset link: ${link}`,
    html: `<p>Reset link: <a href="${link}">${link}</a></p>`
  })
  const preview = nodemailer.getTestMessageUrl(info)
  if (preview) logger.info({ preview }, 'Ethereal preview URL (reset)')
  return { messageId: info.messageId, preview }
}
