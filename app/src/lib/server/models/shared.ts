import { Schema } from 'mongoose'

/** Postal address, stored as a single nested subdocument with no `_id` of its own. */
export const AddressSchema = new Schema(
  {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    street: { type: String },
    houseNumber: { type: String },
    postalCode: { type: String },
  },
  { _id: false },
)

/**
 * GeoJSON Point, spread inline into a parent schema:
 *
 *     location: { ...geoPointField }
 *
 * It cannot be a `new Schema(...)` like the address above: a GeoJSON point has its
 * own `type` key, and Mongoose reads a nested `type` as "this is the field's type",
 * so wrapping it produces `Invalid value for schema path location.default`. Written
 * inline, Mongoose sees `location.type` and `location.coordinates` as two ordinary
 * paths, which is exactly what a 2dsphere index wants.
 *
 * `coordinates` is `[longitude, latitude]` — that order, not the other one.
 */
export const geoPointField = {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] },
} as const
