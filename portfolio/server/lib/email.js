const logger = require('./logger')

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_EMAIL = process.env.ADMIN_EMAIL

function isEmailConfigured() {
  return SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_EMAIL
}

async function sendAutoReply(toEmail, name, subject) {
  if (!isEmailConfigured()) {
    logger.debug('Email not configured, skipping auto-reply')
    return false
  }

  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: parseInt(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: `"Yaseen Ahmad" <${SMTP_USER}>`,
      to: toEmail,
      subject: `Re: ${subject} — Message Received`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: linear-gradient(135deg, #E84393, #6CB4EE); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Thank you for reaching out!</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #F0E6DE; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #4A4A68; font-size: 15px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #4A4A68; font-size: 15px; line-height: 1.6;">
              Thank you for your message regarding <strong>"${subject}"</strong>. I have received your inquiry and will get back to you within 24 hours.
            </p>
            <p style="color: #4A4A68; font-size: 15px; line-height: 1.6;">
              In the meantime, feel free to reach me on
              <a href="https://wa.me/923189370042" style="color: #E84393;">WhatsApp</a>
              for urgent matters.
            </p>
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #F0E6DE;">
              <p style="color: #9CA3AF; font-size: 13px; margin: 0;">Yaseen Ahmad — Full-Stack Developer</p>
              <p style="color: #9CA3AF; font-size: 13px; margin: 4px 0 0;">
                <a href="https://yaseenahmad.dev" style="color: #E84393; text-decoration: none;">yaseenahmad.dev</a>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    logger.info('Auto-reply sent', { to: toEmail, subject })
    return true
  } catch (err) {
    logger.warn('Failed to send auto-reply', { error: err.message })
    return false
  }
}

module.exports = { sendAutoReply, isEmailConfigured }
