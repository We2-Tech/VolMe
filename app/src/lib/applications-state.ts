import type { ApplicationStatus } from './schemas'

/**
 * The application lifecycle, as data.
 *
 * Kept pure and separate from the service so the rules can be tested without a
 * database — and so there is exactly one place that answers "may this become that",
 * rather than an `if` in each Server Action.
 *
 * v1 had `status` as a free string defaulting to `"PENDING"`, plus a separate
 * `isPresented` boolean, and nothing anywhere enforced a transition.
 */

export type Actor = 'APPLICANT' | 'ORGANISER'

interface Transition {
  from: ApplicationStatus
  to: ApplicationStatus
  by: Actor
}

const TRANSITIONS: Transition[] = [
  // The volunteer fills in a draft, then submits it.
  { from: 'DRAFT', to: 'PENDING', by: 'APPLICANT' },
  // …and can pull out at any point before or after a decision.
  { from: 'DRAFT', to: 'WITHDRAWN', by: 'APPLICANT' },
  { from: 'PENDING', to: 'WITHDRAWN', by: 'APPLICANT' },
  { from: 'ACCEPTED', to: 'WITHDRAWN', by: 'APPLICANT' },
  // The organiser decides, and may change their mind either way.
  { from: 'PENDING', to: 'ACCEPTED', by: 'ORGANISER' },
  { from: 'PENDING', to: 'DECLINED', by: 'ORGANISER' },
  { from: 'ACCEPTED', to: 'DECLINED', by: 'ORGANISER' },
  { from: 'DECLINED', to: 'ACCEPTED', by: 'ORGANISER' },
]

export function canTransition(from: ApplicationStatus, to: ApplicationStatus, by: Actor): boolean {
  return TRANSITIONS.some((t) => t.from === from && t.to === to && t.by === by)
}

/** Statuses that count against an event's `peopleNeeded`. */
export const OCCUPIES_A_PLACE: ApplicationStatus[] = ['ACCEPTED']

/** Whether the applicant can still edit the form. */
export function isEditable(status: ApplicationStatus): boolean {
  return status === 'DRAFT'
}

/**
 * Who may post a message on an application. Both sides may keep talking after a
 * decision — a declined applicant asking "why" deserves an answer — but a
 * withdrawn application is closed.
 */
export function canMessage(status: ApplicationStatus): boolean {
  return status !== 'WITHDRAWN'
}

/** A decision is final input for the organiser's queue counters. */
export function isDecided(status: ApplicationStatus): boolean {
  return status === 'ACCEPTED' || status === 'DECLINED'
}
