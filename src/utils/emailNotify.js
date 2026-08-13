import emailjs from '@emailjs/browser'

// A React app can't send email by itself (no SMTP access from the browser, and mailto:
// only opens *your own* mail client — it can't fire silently on someone else's signup).
// EmailJS is a real client-side email service that solves this without needing a backend
// endpoint: it relays through an email account you connect (e.g. your Gmail).
//
// To turn this on:
//   1. Sign up free at https://www.emailjs.com and connect your Gmail as an "Email Service"
//      → copy that service's ID into EMAILJS_SERVICE_ID below.
//   2. Create an Email Template with variables {{username}}, {{full_name}}, {{email}},
//      {{joined_at}} → copy its ID into EMAILJS_TEMPLATE_ID below.
//   3. Copy your account's Public Key (Account → General) into EMAILJS_PUBLIC_KEY below.
// Until these are filled in, new-signup emails are skipped (logged to console), not faked.
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

const ADMIN_EMAIL = 'rohitguptaom45@gmail.com'

function isConfigured() {
  return ![EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY].some((v) => !v || v.startsWith('YOUR_'))
}

// Best-effort and non-blocking — signup should never fail just because this email
// didn't go out (e.g. EmailJS not configured yet, or a network hiccup).
export async function notifyAdminOfNewSignup(user) {
  if (!isConfigured()) {
    console.warn('[emailNotify] EmailJS isn\'t configured yet — skipping the new-signup email. See src/utils/emailNotify.js.')
    return { skipped: true }
  }
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: ADMIN_EMAIL,
        username: user.username,
        full_name: user.fullName || user.username,
        email: user.email || 'n/a',
        joined_at: new Date().toLocaleString(),
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    )
    return { success: true }
  } catch (err) {
    console.error('[emailNotify] Failed to send the new-signup email:', err.message)
    return { error: err.message }
  }
}
