import 'server-only'
import { randomUUID } from 'node:crypto'
import { Types } from 'mongoose'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { connectDB } from '../db'
import { ApplicationModel, DocumentModel, EventModel } from '../models'
import { membershipRole, requireUser } from '../authz'
import { DocumentScopeSchema, type DocumentScope } from '@/lib/schemas'

/**
 * File storage on Cloudflare R2, through the S3 API
 * (docs/decisions/0002-cloudflare-r2-for-file-storage.md).
 *
 * The browser never holds a credential: it asks for a short-lived presigned PUT,
 * uploads straight to R2, then tells us the key. v1 shipped the AWS secret key in
 * the bundle instead.
 */

const UPLOAD_TTL_SECONDS = 60 * 5
const DOWNLOAD_TTL_SECONDS = 60 * 10
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/avif']

let client: S3Client | null = null

function r2(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 is not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY',
    )
  }
  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
  return client
}

const bucket = () => {
  const name = process.env.R2_BUCKET
  if (!name) throw new Error('R2_BUCKET is not set')
  return name
}

/**
 * Hand the browser a one-time upload URL and record the document.
 *
 * The key is generated here, never taken from the client — otherwise a caller could
 * write over someone else's object by choosing its key.
 */
export async function createUpload(input: {
  scope: unknown
  filename: string
  contentType: string
  size: number
  label?: string
}) {
  const user = await requireUser()
  const scope: DocumentScope = DocumentScopeSchema.parse(input.scope)

  if (!ALLOWED_TYPES.includes(input.contentType)) {
    throw new Error('Only PDFs and images can be uploaded')
  }
  if (input.size <= 0 || input.size > MAX_UPLOAD_BYTES) {
    throw new Error('Files must be smaller than 10 MB')
  }

  const extension = input.filename.includes('.')
    ? input.filename.split('.').pop()!.slice(0, 8)
    : 'bin'
  const key = `${scope.toLowerCase()}/${user.id}/${randomUUID()}.${extension}`

  const uploadUrl = await getSignedUrl(
    r2(),
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      ContentType: input.contentType,
      ContentLength: input.size,
    }),
    { expiresIn: UPLOAD_TTL_SECONDS },
  )

  await connectDB()
  const doc = await DocumentModel.create({
    owner: user.id,
    scope,
    label: input.label,
    key,
    filename: input.filename.slice(0, 255),
    contentType: input.contentType,
    size: input.size,
  })

  return { documentId: String(doc._id), key, uploadUrl }
}

/**
 * A short-lived read URL, but only for someone allowed to see the file: its owner,
 * a member of an organisation the owner applied to with it, or an admin
 * (docs/roles.md).
 */
export async function createDownloadUrl(documentId: string): Promise<string> {
  const user = await requireUser()
  await connectDB()

  const doc = await DocumentModel.findById(documentId).lean<{
    _id: Types.ObjectId
    owner: Types.ObjectId
    key: string
    filename: string
  } | null>()
  if (!doc) throw new Error('File not found')

  if (String(doc.owner) !== user.id && user.role !== 'ADMIN') {
    const allowed = await isSharedWithOrganiser(String(doc._id), user.id)
    if (!allowed) throw new Error('Not permitted')
  }

  return getSignedUrl(
    r2(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: doc.key,
      ResponseContentDisposition: `inline; filename="${doc.filename.replace(/"/g, '')}"`,
    }),
    { expiresIn: DOWNLOAD_TTL_SECONDS },
  )
}

/** True when this document is attached to an application whose event belongs to an
 *  organization the viewer is a member of. */
async function isSharedWithOrganiser(documentId: string, viewerId: string): Promise<boolean> {
  const applications = await ApplicationModel.find({ documents: documentId }, { event: 1 }).lean<
    Array<{ event: Types.ObjectId }>
  >()
  if (applications.length === 0) return false

  const events = await EventModel.find(
    { _id: { $in: applications.map((a) => a.event) } },
    { organization: 1 },
  ).lean<Array<{ organization: Types.ObjectId }>>()

  for (const event of events) {
    if (await membershipRole(viewerId, String(event.organization))) return true
  }
  return false
}

/** Only the owner deletes their own file, and only while nothing references it. */
export async function deleteDocument(documentId: string) {
  const user = await requireUser()
  await connectDB()

  const doc = await DocumentModel.findById(documentId).lean<{
    _id: Types.ObjectId
    owner: Types.ObjectId
    key: string
  } | null>()
  if (!doc) return
  if (String(doc.owner) !== user.id && user.role !== 'ADMIN') throw new Error('Not permitted')

  const attached = await ApplicationModel.exists({ documents: doc._id })
  if (attached) throw new Error('This file is attached to an application')

  await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: doc.key }))
  await DocumentModel.deleteOne({ _id: doc._id })
}

/** Public read URL for event images, which are not access-controlled. */
export function publicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  return base ? `${base.replace(/\/$/, '')}/${key}` : ''
}
