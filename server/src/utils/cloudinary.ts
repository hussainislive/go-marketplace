import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

// All assets for this project live under a single namespace in your Cloudinary
// account, so GO Marketplace media is cleanly separated from anything else.
const ROOT_FOLDER = 'go-marketplace'

let configured = false
function ensureConfigured() {
  if (configured) return
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env'
    )
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  configured = true
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
): Promise<{ url: string; publicId: string }> {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `${ROOT_FOLDER}/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'))
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  ensureConfigured()
  await cloudinary.uploader.destroy(publicId)
}

export { cloudinary, UploadApiResponse }
