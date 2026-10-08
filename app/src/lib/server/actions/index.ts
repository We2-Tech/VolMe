'use server'

/**
 * The mutation surface the UI calls.
 *
 * Server Actions rather than Route Handlers: a form posts straight to a function,
 * with no fetch, no endpoint and no client-side cache to invalidate. That is why
 * v1's 1,270 lines of RTK Query have no successor — reads happen in Server
 * Components, writes happen here.
 *
 * Every action is a thin wrapper: parse, delegate to a service, revalidate. The
 * rules live in `../services/`, and the permission checks inside those, so an
 * action can never be the only thing standing between a request and the database.
 *
 * Errors are returned as `{ error }` rather than thrown, because a thrown error in
 * a Server Action reaches the browser as a generic digest with no message. Callers
 * render `error` next to the form.
 */

import { revalidatePath } from 'next/cache'
import * as events from '../services/events'
import * as applications from '../services/applications'
import * as organizations from '../services/organizations'
import * as series from '../services/series'
import * as documents from '../services/documents'
import * as users from '../services/users'

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (err) {
    // Zod issues and our own thrown messages are both written for people to read.
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return { ok: false, error: message }
  }
}

// --- events ---------------------------------------------------------------

export async function createEventAction(organizationId: string, input: unknown) {
  return run(async () => {
    const id = await events.createEvent(organizationId, input)
    revalidatePath('/events')
    return id
  })
}

export async function updateEventAction(eventId: string, input: unknown) {
  return run(async () => {
    await events.updateEvent(eventId, input)
    revalidatePath(`/events/${eventId}`)
    revalidatePath('/events')
  })
}

export async function cancelEventAction(eventId: string) {
  return run(async () => {
    await events.cancelEvent(eventId)
    revalidatePath(`/events/${eventId}`)
    revalidatePath('/events')
  })
}

export async function deleteEventAction(eventId: string) {
  return run(async () => {
    await events.deleteEvent(eventId)
    revalidatePath('/events')
  })
}

export async function addReviewAction(eventId: string, input: unknown) {
  return run(async () => {
    await events.addReview(eventId, input)
    revalidatePath(`/events/${eventId}`)
  })
}

export async function deleteReviewAction(eventId: string, reviewId: string) {
  return run(async () => {
    await events.deleteReview(eventId, reviewId)
    revalidatePath(`/events/${eventId}`)
  })
}

// --- series ---------------------------------------------------------------

export async function createSeriesAction(organizationId: string, input: unknown, rule: unknown) {
  return run(async () => {
    const id = await series.createSeries(organizationId, input, rule)
    revalidatePath('/events')
    return id
  })
}

export async function updateSeriesFromOccurrenceAction(eventId: string, input: unknown) {
  return run(async () => {
    await series.updateSeriesFromOccurrence(eventId, input)
    revalidatePath('/events')
  })
}

export async function endSeriesAction(seriesId: string) {
  return run(async () => {
    await series.endSeries(seriesId)
    revalidatePath('/events')
  })
}

// --- applications ---------------------------------------------------------

export async function saveApplicationAction(eventId: string, input: unknown) {
  return run(async () => {
    await applications.saveApplication(eventId, input)
    revalidatePath(`/events/${eventId}`)
  })
}

export async function submitApplicationAction(eventId: string) {
  return run(async () => {
    await applications.submitApplication(eventId)
    revalidatePath(`/events/${eventId}`)
    revalidatePath('/my-events')
  })
}

export async function withdrawApplicationAction(eventId: string) {
  return run(async () => {
    await applications.withdrawApplication(eventId)
    revalidatePath(`/events/${eventId}`)
    revalidatePath('/my-events')
  })
}

export async function decideApplicationAction(applicationId: string, input: unknown) {
  return run(async () => {
    await applications.decideApplication(applicationId, input)
    revalidatePath('/my-events')
  })
}

export async function markAttendanceAction(applicationId: string, attended: boolean) {
  return run(() => applications.markAttendance(applicationId, attended))
}

export async function postMessageAction(applicationId: string, body: string) {
  return run(async () => {
    await applications.postMessage(applicationId, body)
    revalidatePath('/my-events')
  })
}

// --- organizations --------------------------------------------------------

export async function createOrganizationAction(input: unknown) {
  return run(() => organizations.createOrganization(input))
}

export async function updateOrganizationAction(organizationId: string, input: unknown) {
  return run(async () => {
    await organizations.updateOrganization(organizationId, input)
    revalidatePath('/organizations')
  })
}

export async function inviteMemberAction(organizationId: string, input: unknown) {
  return run(() => organizations.inviteMember(organizationId, input))
}

export async function acceptInvitationAction(token: string) {
  return run(() => organizations.acceptInvitation(token))
}

export async function changeMemberRoleAction(
  organizationId: string,
  memberUserId: string,
  role: unknown,
) {
  return run(() => organizations.changeMemberRole(organizationId, memberUserId, role))
}

export async function removeMemberAction(organizationId: string, memberUserId: string) {
  return run(() => organizations.removeMember(organizationId, memberUserId))
}

export async function leaveOrganizationAction(organizationId: string) {
  return run(() => organizations.leaveOrganization(organizationId))
}

// --- documents ------------------------------------------------------------

export async function createUploadAction(input: {
  scope: string
  filename: string
  contentType: string
  size: number
  label?: string
}) {
  return run(() => documents.createUpload(input))
}

export async function createDownloadUrlAction(documentId: string) {
  return run(() => documents.createDownloadUrl(documentId))
}

export async function deleteDocumentAction(documentId: string) {
  return run(() => documents.deleteDocument(documentId))
}

// --- profile --------------------------------------------------------------

export async function updateMyProfileAction(input: unknown) {
  return run(async () => {
    await users.updateMyProfile(input)
    revalidatePath('/profile')
  })
}
