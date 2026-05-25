import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'))
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export { cloudinary, UploadApiResponse }
