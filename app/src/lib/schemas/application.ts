import { z } from 'zod'
import { ObjectIdSchema } from './common'
import { ApplicationStatusSchema, DocumentScopeSchema } from './enums'

/** An answer to one of the event's `customQuestions`, keyed by that question's id. */
export const CustomAnswerSchema = z.object({
  questionId: z.string().min(1).max(40),
  answer: z.string().max(2000),
})

export type CustomAnswer = z.infer<typeof CustomAnswerSchema>

/**
 * One message on an application.
 *
 * This replaces v1's chat, which never worked — its `/api/messages` prefix was
 * never mounted (docs/decisions/0006-drop-in-app-chat.md). Messages are append-only
 * and scoped to a single application: readable by the applicant and by members of
 * the organisation that owns the event, nobody else.
 */
export const ApplicationMessageSchema = z.object({
  author: ObjectIdSchema,
  body: z.string().min(1).max(4000),
  createdAt: z.coerce.date(),
})

export type ApplicationMessage = z.infer<typeof ApplicationMessageSchema>

/**
 * A volunteer's application to one event. `(event, applicant)` is unique.
 */
export const ApplicationSchema = z.object({
  id: ObjectIdSchema,
  event: ObjectIdSchema,
  applicant: ObjectIdSchema,
  status: ApplicationStatusSchema.default('DRAFT'),

  motivation: z.string().max(4000).default(''),
  answers: z.array(CustomAnswerSchema).max(20).default([]),
  /** Documents attached to satisfy the event's `requiredFiles`. */
  documents: z.array(ObjectIdSchema).max(10).default([]),

  messages: z.array(ApplicationMessageSchema).max(200).default([]),

  /** Set when the organiser decided. `null` while the status is DRAFT or PENDING. */
  decidedAt: z.coerce.date().nullable().default(null),
  decidedBy: ObjectIdSchema.nullable().default(null),
  /** Marked by the organiser after the event: the volunteer actually turned up. */
  attended: z.boolean().default(false),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Application = z.infer<typeof ApplicationSchema>

export const ApplicationFormSchema = ApplicationSchema.pick({
  motivation: true,
  answers: true,
  documents: true,
})

export type ApplicationForm = z.infer<typeof ApplicationFormSchema>

/** Organiser's decision. Only these two transitions are exposed. */
export const ApplicationDecisionSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
  message: z.string().max(4000).optional(),
})

export type ApplicationDecision = z.infer<typeof ApplicationDecisionSchema>

/**
 * A file in R2.
 *
 * `key` is the R2 object key, never a URL — reads go through a presigned GET or the
 * public base URL, both of which can change without touching stored data
 * (docs/decisions/0002-cloudflare-r2-for-file-storage.md).
 */
export const DocumentSchema = z.object({
  id: ObjectIdSchema,
  owner: ObjectIdSchema,
  scope: DocumentScopeSchema,
  /** Free-text label matching the event's `requiredFiles` entry, when scope is APPLICATION. */
  label: z.string().max(120).optional(),
  key: z.string().min(1).max(300),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Document = z.infer<typeof DocumentSchema>
