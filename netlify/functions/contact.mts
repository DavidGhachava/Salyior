import type { Config } from '@netlify/functions'

type ContactPayload = {
  name?: string
  email?: string
  businessName?: string
  website?: string
  problem?: string
  budget?: string
  features?: string[]
  company?: string
  startedAt?: number
  source?: string
}

const required: (keyof ContactPayload)[] = ['name', 'email', 'businessName', 'problem', 'budget']

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  })
}

function clean(value: unknown, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }
  return value.replace(/[&<>'"]/g, (character) => entities[character] || character)
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return json(405, { message: 'Method not allowed.' }, { Allow: 'POST' })

  if (Number(request.headers.get('content-length') || 0) > 16_000) {
    return json(413, { message: 'The submitted form data is too large.' })
  }

  let payload: ContactPayload
  try {
    const rawBody = await request.text()
    if (rawBody.length > 16_000) return json(413, { message: 'The submitted form data is too large.' })
    payload = JSON.parse(rawBody) as ContactPayload
  } catch {
    return json(400, { message: 'The submitted form data is invalid.' })
  }

  if (clean(payload.company)) return json(200, { message: 'Project details received.' })
  if (!payload.startedAt || Date.now() - Number(payload.startedAt) < 2500) {
    return json(400, { message: 'Please take a moment to review the form and try again.' })
  }

  const { features, ...textPayload } = payload
  const normalized = Object.fromEntries(
    Object.entries(textPayload).map(([key, value]) => [key, clean(value, key === 'problem' ? 4000 : 500)]),
  ) as Record<string, string>
  const normalizedFeatures = Array.isArray(features)
    ? features.map((feature) => clean(feature, 100)).filter(Boolean).slice(0, 8)
    : []

  const missing = required.filter((field) => !normalized[field])
  if (missing.length) return json(400, { message: 'Please complete all required fields.' })
  if (!/^\S+@\S+\.\S+$/.test(normalized.email)) return json(400, { message: 'Please enter a valid email address.' })

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !toEmail || !fromEmail) {
    console.error('Contact endpoint is missing email environment variables.')
    return json(503, { message: 'Email delivery is being configured. Please email hello@salyior.com directly for now.' })
  }

  const rows = [
    ['Name', normalized.name],
    ['Email', normalized.email],
    ['Business', normalized.businessName],
    ['Website / social', normalized.website || 'Not provided'],
    ['Project brief', normalized.problem],
    ['Budget', normalized.budget],
    ['Advanced functionality', normalizedFeatures.join(', ') || 'Not specified'],
    ['Source', normalized.source || 'Website'],
  ]
  const text = rows.map(([label, value]) => `${label}:\n${value}`).join('\n\n')
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;color:#17201a"><h1>New SALYIOR project inquiry</h1>${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`).join('')}</div>`

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: normalized.email,
      subject: `Project inquiry — ${normalized.businessName}`,
      text,
      html,
    }),
  })

  if (!emailResponse.ok) {
    console.error('Email provider rejected contact request.', await emailResponse.text())
    return json(502, { message: 'The details could not be delivered. Please email hello@salyior.com directly.' })
  }

  return json(200, { message: 'Project details received.' })
}

export const config: Config = {
  path: '/api/contact',
  rateLimit: {
    windowLimit: 5,
    windowSize: 180,
    aggregateBy: ['ip'],
  },
}
