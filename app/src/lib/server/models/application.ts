import mongoose, { Schema } from 'mongoose'

/**
 * Messages are append-only and scoped to this application — the replacement for
 * v1's chat (docs/decisions/0006-drop-in-app-chat.md). Readable by the applicant
 * and by members of the organisation that owns the event, nobody else.
 */
const ApplicationMessageSubSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const ApplicationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'],
      default: 'DRAFT',
    },

    motivation: { type: String, default: '' },
    answers: {
      type: [{ questionId: String, answer: String }],
      _id: false,
      default: [],
    },
    documents: { type: [{ type: Schema.Types.ObjectId, ref: 'Document' }], default: [] },

    messages: { type: [ApplicationMessageSubSchema], default: [] },

    decidedAt: { type: Date, default: null },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// One application per person per event.
ApplicationSchema.index({ event: 1, applicant: 1 }, { unique: true })
// The organiser's review queue.
ApplicationSchema.index({ event: 1, status: 1 })

/**
 * A file in R2. `key` is the object key, never a URL, so the public base or the
 * signing strategy can change without touching stored data
 * (docs/decisions/0002-cloudflare-r2-for-file-storage.md).
 */
const DocumentSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scope: {
      type: String,
      enum: ['PROFILE', 'APPLICATION', 'ORGANIZATION'],
      required: true,
    },
    label: { type: String },
    key: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true },
)

export const ApplicationModel =
  mongoose.models.Application ?? mongoose.model('Application', ApplicationSchema)
export const DocumentModel = mongoose.models.Document ?? mongoose.model('Document', DocumentSchema)
