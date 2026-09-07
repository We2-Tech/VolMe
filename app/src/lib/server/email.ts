import 'server-only'

/**
 * Transactional email over the Resend HTTP API.
 *
 * No SDK and no React Email: the whole surface is one POST, and the four messages
 * below are short enough that a template function beats a component tree plus two
 * dependencies. Revisit if the templates ever need real layout.
 *
 * Sending reuses `AUTH_RESEND_KEY`, the same key Auth.js signs people in with —
 * one key, one sending domain. Without it, in development, mail is logged instead
 * of sent, matching what the sign-in link does (docs/decisions/0008).
 */

const ENDPOINT = 'https://api.resend.com/emails'

interface Mail {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: Mail): Promise<void> {
  const key = process.env.AUTH_RESEND_KEY
  const from = process.env.AUTH_EMAIL_FROM ?? 'VolMe <onboarding@resend.dev>'

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_RESEND_KEY is required to send email')
    }
    console.log(`\n  [email] to ${to}\n  ${subject}\n`)
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!res.ok) {
    // Never let a failed notification roll back the thing it was notifying about:
    // an accepted volunteer stays accepted even if the mail bounces.
    console.error(`[email] ${res.status} sending "${subject}" to ${to}`)
  }
}

const shell = (title: string, body: string) => `
<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#171c18">
  <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
  ${body}
  <p style="margin-top:32px;font-size:13px;color:#7c8a80">VolMe</p>
</div>`

const p = (text: string) =>
  `<p style="font-size:15px;line-height:1.6;margin:0 0 12px">${escapeHtml(text)}</p>`

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const onDate = (date: Date) =>
  new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Berlin',
  }).format(date)

export async function sendApplicationReceived(args: {
  to: string
  volunteerName: string
  eventTitle: string
  startDate: Date
}) {
  await sendEmail({
    to: args.to,
    subject: `Application received — ${args.eventTitle}`,
    html: shell(
      'Your application is in',
      p(`Hi ${args.volunteerName},`) +
        p(
          `We passed your application for "${args.eventTitle}" on ${onDate(args.startDate)} to the organisers.`,
        ) +
        p('They will let you know as soon as they have decided.'),
    ),
  })
}

export async function sendApplicationDecided(args: {
  to: string
  volunteerName: string
  eventTitle: string
  startDate: Date
  accepted: boolean
  note?: string
}) {
  await sendEmail({
    to: args.to,
    subject: args.accepted
      ? `You're in — ${args.eventTitle}`
      : `About your application — ${args.eventTitle}`,
    html: shell(
      args.accepted ? 'You have a place' : 'Not this time',
      p(`Hi ${args.volunteerName},`) +
        p(
          args.accepted
            ? `You have a place at "${args.eventTitle}" on ${onDate(args.startDate)}. See you there.`
            : `The organisers of "${args.eventTitle}" on ${onDate(args.startDate)} could not offer you a place this time.`,
        ) +
        (args.note ? p(`From the organisers: ${args.note}`) : '') +
        (args.accepted ? '' : p('Plenty of other events need volunteers — have another look.')),
    ),
  })
}

export async function sendNewApplicationToOrganisers(args: {
  to: string
  eventTitle: string
  volunteerName: string
  pendingCount: number
}) {
  await sendEmail({
    to: args.to,
    subject: `New application — ${args.eventTitle}`,
    html: shell(
      'Someone applied',
      p(`${args.volunteerName} applied to "${args.eventTitle}".`) +
        p(`${args.pendingCount} application(s) are waiting for a decision.`),
    ),
  })
}

export async function sendOrganizationInvitation(args: {
  to: string
  organizationName: string
  invitedByName: string
  acceptUrl: string
}) {
  await sendEmail({
    to: args.to,
    subject: `Join ${args.organizationName} on VolMe`,
    html: shell(
      `Join ${args.organizationName}`,
      p(`${args.invitedByName} invited you to help manage ${args.organizationName} on VolMe.`) +
        `<p style="margin:0 0 12px"><a href="${args.acceptUrl}" style="display:inline-block;padding:10px 18px;background:#2e6b4c;color:#fff;border-radius:6px;text-decoration:none;font-size:15px">Accept the invitation</a></p>` +
        p('The link works once and expires in seven days.'),
    ),
  })
}
