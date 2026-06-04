const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

const SENDER = { name: 'GO Marketplace', email: 'developer.hussain125@gmail.com' }

// Send a transactional email via Brevo's HTTP API (HTTPS port 443).
// We use the HTTP API instead of SMTP because cloud hosts (Railway) block
// outbound SMTP ports (25/465/587); HTTPS is never blocked.
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error('BREVO_API_KEY must be set')

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Brevo API error ${res.status}: ${body}`)
  }
}

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/verify-email?token=${token}`
  await sendEmail(
    to,
    'Verify your GO Marketplace account',
    `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="background:linear-gradient(135deg,#C82C8C,#8A1D9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin:0 0 8px;">GO</h1>
        <p style="color:#232323;font-size:15px;">Hi ${name},</p>
        <p style="color:#232323;font-size:15px;">Please verify your email address to start buying and selling on GO Marketplace.</p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#C82C8C,#8A1D9D);color:#fff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:500;">Verify Email</a>
        <p style="color:#232323;opacity:0.6;font-size:12px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `
  )
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/reset-password?token=${token}`
  await sendEmail(
    to,
    'Reset your GO Marketplace password',
    `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="background:linear-gradient(135deg,#C82C8C,#8A1D9D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin:0 0 8px;">GO</h1>
        <p style="color:#232323;font-size:15px;">Hi ${name},</p>
        <p style="color:#232323;font-size:15px;">We received a request to reset your password.</p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#C82C8C,#8A1D9D);color:#fff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:500;">Reset Password</a>
        <p style="color:#232323;opacity:0.6;font-size:12px;">This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.</p>
      </div>
    `
  )
}
