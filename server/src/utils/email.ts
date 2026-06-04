import nodemailer from 'nodemailer'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

function getTransport() {
  const host = process.env.BREVO_SMTP_HOST
  const port = Number(process.env.BREVO_SMTP_PORT ?? 587)
  const user = process.env.BREVO_SMTP_USER
  const pass = process.env.BREVO_SMTP_PASS
  if (!host || !user || !pass) throw new Error('Brevo SMTP env vars (BREVO_SMTP_HOST, BREVO_SMTP_USER, BREVO_SMTP_PASS) must be set')
  return nodemailer.createTransport({ host, port: 465, secure: true, auth: { user, pass } })
}

function from(): string {
  return 'GO Marketplace <developer.hussain125@gmail.com>'
}

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/verify-email?token=${token}`
  await getTransport().sendMail({
    from: from(),
    to,
    subject: 'Verify your GO Marketplace account',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="background:linear-gradient(135deg,#C82C8C,#8A1D9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin:0 0 8px;">GO</h1>
        <p style="color:#232323;font-size:15px;">Hi ${name},</p>
        <p style="color:#232323;font-size:15px;">Please verify your email address to start buying and selling on GO Marketplace.</p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#C82C8C,#8A1D9D);color:#fff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:500;">Verify Email</a>
        <p style="color:#232323;opacity:0.6;font-size:12px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/reset-password?token=${token}`
  await getTransport().sendMail({
    from: from(),
    to,
    subject: 'Reset your GO Marketplace password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="background:linear-gradient(135deg,#C82C8C,#8A1D9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin:0 0 8px;">GO</h1>
        <p style="color:#232323;font-size:15px;">Hi ${name},</p>
        <p style="color:#232323;font-size:15px;">We received a request to reset your password.</p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#C82C8C,#8A1D9D);color:#fff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:500;">Reset Password</a>
        <p style="color:#232323;opacity:0.6;font-size:12px;">This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.</p>
      </div>
    `,
  })
}
