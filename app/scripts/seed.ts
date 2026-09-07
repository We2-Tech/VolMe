/**
 * Fills an empty database with enough data to click through the app.
 *
 * v1's data is not migrated (docs/decisions/0001-rewrite-volme-on-this-template.md),
 * so this replaces the "restore a production snapshot" step: every developer and CI
 * run rebuilds the same fixture from scratch.
 *
 *   npm run seed          # wipe VolMe's collections and reseed
 *
 * It refuses to touch a database whose name doesn't look like a development one,
 * so a mistyped MONGO_URI cannot wipe something real.
 *
 * Imports are relative, not `@/…`: this runs under plain `node`, which strips the
 * types but does not resolve tsconfig path aliases.
 */

import mongoose from 'mongoose'
import { UserModel } from '../src/lib/server/models/user.ts'
import { OrganizationModel, MembershipModel } from '../src/lib/server/models/organization.ts'
import { EventModel, ReviewModel } from '../src/lib/server/models/event.ts'
import { ApplicationModel } from '../src/lib/server/models/application.ts'

const uri = process.env.MONGO_URI
if (!uri) {
  console.error('MONGO_URI is not set. Run with: node --env-file=.env scripts/seed.ts')
  process.exit(1)
}

const dbName = new URL(
  uri.replace(/^mongodb\+srv:/, 'https:').replace(/^mongodb:/, 'http:'),
).pathname
  .slice(1)
  .split('?')[0]

if (!/^volme(-dev|-test|_dev|_test)?$/.test(dbName)) {
  console.error(
    `Refusing to seed database "${dbName}". Expected volme, volme-dev, volme-test, ` +
      `volme_dev or volme_test — rename the database in MONGO_URI if this is really a dev database.`,
  )
  process.exit(1)
}

const day = 24 * 60 * 60 * 1000
const at = (daysFromNow: number, hour = 10) => {
  const d = new Date(Date.now() + daysFromNow * day)
  d.setHours(hour, 0, 0, 0)
  return d
}

const MUNICH = { country: 'DE', state: 'Bayern', city: 'München', postalCode: '80331' }
// Marienplatz, as [longitude, latitude] — the order a 2dsphere index expects.
const MUNICH_POINT = { type: 'Point' as const, coordinates: [11.5755, 48.1374] }

async function main() {
  await mongoose.connect(uri!)
  console.log(`connected to ${dbName}`)

  await Promise.all([
    UserModel.deleteMany({}),
    OrganizationModel.deleteMany({}),
    MembershipModel.deleteMany({}),
    EventModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    ApplicationModel.deleteMany({}),
  ])
  console.log('cleared VolMe collections')

  // --- people -------------------------------------------------------------
  const [admin, anna, ben, clara, david] = await UserModel.create([
    {
      email: 'admin@volme.test',
      name: 'Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    {
      email: 'anna@volme.test',
      name: 'Anna Weber',
      role: 'USER',
      emailVerified: new Date(),
      bio: 'Coordinates the food bank on weekends.',
      languages: ['de', 'en'],
      skills: ['Logistik', 'Erste Hilfe'],
      address: MUNICH,
    },
    {
      email: 'ben@volme.test',
      name: 'Ben Okoro',
      role: 'USER',
      emailVerified: new Date(),
      languages: ['en', 'de'],
      skills: ['Nachhilfe'],
      address: MUNICH,
    },
    {
      email: 'clara@volme.test',
      name: 'Clara Fischer',
      role: 'USER',
      emailVerified: new Date(),
      languages: ['de'],
      address: MUNICH,
    },
    {
      email: 'david@volme.test',
      name: 'David Lin',
      role: 'USER',
      emailVerified: new Date(),
      languages: ['en', 'zh'],
      address: MUNICH,
    },
  ])

  // --- organizations ------------------------------------------------------
  const [tafel, umwelt, stadt] = await OrganizationModel.create([
    {
      name: 'Münchner Tafel e.V.',
      slug: 'muenchner-tafel',
      type: 'NONPROFIT',
      description: 'Verteilt gerettete Lebensmittel an Menschen in Not.',
      email: 'kontakt@tafel.volme.test',
      address: MUNICH,
      location: MUNICH_POINT,
      isVerified: true,
    },
    {
      name: 'Umweltinitiative Isar',
      slug: 'umweltinitiative-isar',
      type: 'NONPROFIT',
      description: 'Renaturierung und Müllsammelaktionen entlang der Isar.',
      address: MUNICH,
      location: MUNICH_POINT,
    },
    {
      name: 'Landeshauptstadt München — Ehrenamtsbüro',
      slug: 'lh-muenchen-ehrenamt',
      type: 'PUBLIC_BODY',
      description: 'Städtische Koordinationsstelle für bürgerschaftliches Engagement.',
      address: MUNICH,
      location: MUNICH_POINT,
      isVerified: true,
    },
  ])

  // Anna owns the Tafel and is also a plain member of the city office — the case
  // v1 could not express at all, because organiser-ness lived on the user record.
  await MembershipModel.create([
    { user: anna._id, organization: tafel._id, role: 'OWNER' },
    { user: ben._id, organization: tafel._id, role: 'MEMBER' },
    { user: anna._id, organization: stadt._id, role: 'MEMBER' },
    { user: clara._id, organization: umwelt._id, role: 'OWNER' },
  ])

  // --- events -------------------------------------------------------------
  // The fourth event is a draft; it is created for the UI to show, not used below.
  const [ausgabe, isar, pastEvent] = await EventModel.create([
    {
      organization: tafel._id,
      createdBy: anna._id,
      title: 'Lebensmittelausgabe Neuperlach',
      description:
        'Wir sortieren gespendete Lebensmittel und geben sie an Besucher*innen aus. Keine Vorkenntnisse nötig, Einweisung vor Ort.',
      category: 'HF',
      languages: ['de', 'en'],
      isDraft: false,
      publishedAt: new Date(),
      startDate: at(7),
      endDate: at(7, 14),
      address: { ...MUNICH, street: 'Plettstraße', houseNumber: '10' },
      location: MUNICH_POINT,
      peopleNeeded: 8,
      requiredFiles: ['Führungszeugnis'],
      customQuestions: [
        { id: 'lifting', label: 'Kannst du Kisten bis 15 kg tragen?', required: true },
      ],
    },
    {
      organization: umwelt._id,
      createdBy: clara._id,
      title: 'Isar-Cleanup Flaucher',
      description: 'Müllsammelaktion am Flaucher. Handschuhe und Säcke stellen wir.',
      category: 'EC',
      languages: ['de'],
      isDraft: false,
      publishedAt: new Date(),
      startDate: at(21),
      endDate: at(21, 13),
      address: { ...MUNICH, street: 'Flauchersteg' },
      location: MUNICH_POINT,
      peopleNeeded: 25,
    },
    {
      organization: tafel._id,
      createdBy: anna._id,
      title: 'Weihnachtspäckchen packen',
      description: 'Rückblick: gemeinsames Packen der Weihnachtspäckchen.',
      category: 'CS',
      languages: ['de'],
      isDraft: false,
      publishedAt: at(-40),
      startDate: at(-30),
      endDate: at(-30, 16),
      address: MUNICH,
      location: MUNICH_POINT,
      peopleNeeded: 12,
    },
    {
      organization: stadt._id,
      createdBy: anna._id,
      title: 'Freiwilligenmesse 2027 (Entwurf)',
      description: 'Noch nicht veröffentlicht — dient zum Testen der Entwurfsansicht.',
      category: 'OT',
      languages: ['de', 'en'],
      isDraft: true,
      startDate: at(120),
      endDate: at(120, 18),
      address: MUNICH,
      location: MUNICH_POINT,
      peopleNeeded: 40,
    },
  ])

  // --- applications -------------------------------------------------------
  await ApplicationModel.create([
    {
      event: ausgabe._id,
      applicant: david._id,
      status: 'PENDING',
      motivation: 'Ich wohne um die Ecke und habe freitags Zeit.',
      answers: [{ questionId: 'lifting', answer: 'Ja' }],
      messages: [
        {
          author: anna._id,
          body: 'Hallo David, passt dir 9:30 Uhr zur Einweisung?',
          createdAt: new Date(),
        },
      ],
    },
    {
      event: ausgabe._id,
      applicant: clara._id,
      status: 'ACCEPTED',
      motivation: 'Ich war letztes Jahr schon dabei.',
      answers: [{ questionId: 'lifting', answer: 'Ja' }],
      decidedAt: new Date(),
      decidedBy: anna._id,
    },
    {
      event: pastEvent._id,
      applicant: david._id,
      status: 'ACCEPTED',
      motivation: 'Gerne wieder.',
      decidedAt: at(-35),
      decidedBy: anna._id,
      attended: true,
    },
    {
      event: isar._id,
      applicant: ben._id,
      status: 'DRAFT',
      motivation: '',
    },
  ])

  // --- reviews ------------------------------------------------------------
  // Only for the event that already happened, and only from someone who attended.
  await ReviewModel.create([
    {
      event: pastEvent._id,
      author: david._id,
      rating: 5,
      comment: 'Gut organisiert, freundliches Team.',
    },
  ])
  await EventModel.updateOne({ _id: pastEvent._id }, { rating: 5, reviewCount: 1 })

  // --- wishlist -----------------------------------------------------------
  await UserModel.updateOne({ _id: david._id }, { wishlist: [isar._id] })

  const counts = {
    users: await UserModel.countDocuments(),
    organizations: await OrganizationModel.countDocuments(),
    memberships: await MembershipModel.countDocuments(),
    events: await EventModel.countDocuments(),
    applications: await ApplicationModel.countDocuments(),
    reviews: await ReviewModel.countDocuments(),
  }
  console.log('seeded', counts)
  console.log(`admin: ${admin.email}   organiser: ${anna.email}   volunteer: ${david.email}`)

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
