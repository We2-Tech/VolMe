import mongoose, { Schema } from 'mongoose'
import { EVENT_CATEGORIES } from '../../schemas/enums.ts'
import { AddressSchema, geoPointField } from './shared.ts'

const EventSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    // Attribution only. Whether someone may edit this event is decided by their
    // membership of `organization`, never by matching this field — docs/roles.md.
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, enum: [...EVENT_CATEGORIES], required: true },
    languages: { type: [String], default: [] },

    isDraft: { type: Boolean, default: true },
    publishedAt: { type: Date, default: null },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // One occurrence of a repeating series, or null for a one-off. Nothing else on
    // the document changes — docs/decisions/0009.
    series: { type: Schema.Types.ObjectId, ref: 'EventSeries', default: null, index: true },
    isCancelled: { type: Boolean, default: false },

    address: { type: AddressSchema },
    location: { ...geoPointField },
    isRemote: { type: Boolean, default: false },

    peopleNeeded: { type: Number, required: true },
    requiredFiles: { type: [String], default: [] },
    customQuestions: {
      type: [{ id: String, label: String, required: Boolean }],
      _id: false,
      default: [],
    },

    // R2 object keys, not URLs — docs/decisions/0002-cloudflare-r2-for-file-storage.md
    images: { type: [String], default: [] },

    // Denormalised from the Review collection; recomputed on every review write.
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// The event list's default query: published events, soonest first.
EventSchema.index({ isDraft: 1, startDate: 1 })
EventSchema.index({ category: 1, startDate: 1 })
EventSchema.index({ 'address.country': 1, 'address.city': 1, startDate: 1 })
EventSchema.index({ location: '2dsphere' })
EventSchema.index({ title: 'text', description: 'text' })

/**
 * Reviews live only here. v1 also embedded a copy in `Event.reviews`, so the array
 * and the collection could disagree about the same review.
 */
const ReviewSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
)

// One review per person per event.
ReviewSchema.index({ event: 1, author: 1 }, { unique: true })

/**
 * A repeating event: the rule plus the content its occurrences share. The
 * occurrences themselves are ordinary Event documents pointing back here.
 */
const EventSeriesSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rule: {
      type: {
        freq: { type: String, enum: ['WEEKLY', 'MONTHLY'], required: true },
        interval: { type: Number, default: 1 },
        byWeekday: { type: [Number], default: [] },
        bySetPos: { type: Number },
        startTime: { type: String, required: true },
        durationMinutes: { type: Number, required: true },
        timezone: { type: String, required: true },
        until: { type: Date },
        count: { type: Number },
      },
      _id: false,
      required: true,
    },
    seriesStart: { type: String, required: true },
    // How far occurrences have been materialised; the top-up runs when a read
    // comes close to it.
    generatedUntil: { type: Date, default: null, index: true },
  },
  { timestamps: true },
)

// One occurrence per series per instant — the guard that makes generation
// idempotent, so a concurrent top-up cannot double-create a date.
EventSchema.index(
  { series: 1, startDate: 1 },
  { unique: true, partialFilterExpression: { series: { $type: 'objectId' } } },
)

export const EventSeriesModel =
  mongoose.models.EventSeries ?? mongoose.model('EventSeries', EventSeriesSchema)
export const EventModel = mongoose.models.Event ?? mongoose.model('Event', EventSchema)
export const ReviewModel = mongoose.models.Review ?? mongoose.model('Review', ReviewSchema)
