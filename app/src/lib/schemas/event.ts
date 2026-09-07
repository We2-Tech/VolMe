import { z } from 'zod'
import { ObjectIdSchema, AddressSchema, GeoPointSchema, BooleanParamSchema } from './common'
import { EventCategorySchema, LanguageSchema } from './enums'

/**
 * An extra question an organiser adds to their event's application form.
 * v1 stored these as untyped `{type: Object}`, so nothing could validate an answer.
 */
export const CustomQuestionSchema = z.object({
  id: z.string().min(1).max(40),
  label: z.string().min(1).max(200),
  required: z.boolean().default(false),
})

export type CustomQuestion = z.infer<typeof CustomQuestionSchema>

/**
 * A volunteering event.
 *
 * `organization` replaces v1's `organiser` (which pointed at a User) — events belong
 * to the organisation, not to whoever happened to be logged in
 * (docs/decisions/0005-two-layer-role-model.md).
 *
 * Two v1 fields are gone: `creationPlan`, which recorded the organiser's paid tier
 * (docs/decisions/0004), and the embedded `reviews` array, which duplicated the
 * separate Review collection and let the two disagree.
 */
export const EventSchema = z.object({
  id: ObjectIdSchema,
  organization: ObjectIdSchema,
  /** The member who published it. For attribution and audit only — permission comes
   *  from membership of `organization`, never from this field. */
  createdBy: ObjectIdSchema,

  title: z.string().min(3).max(200),
  description: z.string().max(20000).default(''),
  category: EventCategorySchema,
  languages: z.array(LanguageSchema).min(1).max(6),

  isDraft: z.boolean().default(true),
  publishedAt: z.coerce.date().nullable().default(null),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  /** Set when this event is one occurrence of a repeating series; `null` for a
   *  one-off. Everything else on the document behaves identically either way —
   *  docs/decisions/0009-recurring-events-as-series-plus-occurrences.md. */
  series: ObjectIdSchema.nullable().default(null),
  /** A single occurrence called off. The event stays visible, so people who were
   *  already accepted can see that this date is cancelled. */
  isCancelled: z.boolean().default(false),

  address: AddressSchema,
  location: GeoPointSchema.optional(),
  isRemote: z.boolean().default(false),

  peopleNeeded: z.number().int().min(1).max(10000),
  /** Free text, one entry per document an applicant must upload. */
  requiredFiles: z.array(z.string().min(1).max(120)).max(10).default([]),
  customQuestions: z.array(CustomQuestionSchema).max(20).default([]),

  /** R2 object keys, not URLs — the public base can change without a data migration. */
  images: z.array(z.string().min(1).max(300)).max(10).default([]),

  /** Denormalised from Review; recomputed on every review write. */
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Event = z.infer<typeof EventSchema>

/** What the create/edit form submits. Server-owned fields are absent by design. */
export const EventFormSchema = EventSchema.pick({
  title: true,
  description: true,
  category: true,
  languages: true,
  isDraft: true,
  startDate: true,
  endDate: true,
  address: true,
  isRemote: true,
  peopleNeeded: true,
  requiredFiles: true,
  customQuestions: true,
  images: true,
}).refine((e) => e.endDate >= e.startDate, {
  message: 'The end date cannot be before the start date',
  path: ['endDate'],
})

export type EventForm = z.infer<typeof EventFormSchema>

/**
 * The event list's URL state. Every filter is a search param so a filtered list is
 * a shareable, indexable URL — v1 filtered client-side, so it was neither.
 */
export const EventSearchParamsSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.array(EventCategorySchema).max(18).optional(),
  language: z.array(LanguageSchema).max(6).optional(),
  country: z.string().length(2).optional(),
  city: z.string().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  remote: BooleanParamSchema.optional(),
  /** v1 ranked paid organisers first; with payments gone the default is the event
   *  starting soonest (docs/decisions/0004). */
  sort: z.enum(['startDate', 'newest', 'rating']).default('startDate'),
  page: z.coerce.number().int().min(1).default(1),
})

export type EventSearchParams = z.infer<typeof EventSearchParamsSchema>

/**
 * A volunteer's review of an event they attended.
 * Its own collection only — v1 also embedded a copy inside `Event.reviews`.
 */
export const ReviewSchema = z.object({
  id: ObjectIdSchema,
  event: ObjectIdSchema,
  author: ObjectIdSchema,
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Review = z.infer<typeof ReviewSchema>

export const ReviewFormSchema = ReviewSchema.pick({ rating: true, comment: true })
export type ReviewForm = z.infer<typeof ReviewFormSchema>
