import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import { ApiError } from '../utils/ApiError'

const MB = 1024 * 1024

const storage = multer.memoryStorage()

function imageFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Only image files are allowed'))
  }
}

function mediaFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/')
  ) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Only image, video, or audio files are allowed'))
  }
}

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * MB, files: 10 },
}).array('images', 10)

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * MB, files: 1 },
}).single('avatar')

export const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 50 * MB, files: 1 },
}).single('media')
