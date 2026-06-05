import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success } from '../utils/ApiResponse'
import { sendContactEmail } from '../utils/email'
import type { ContactInput } from '../validators/contact.validator'

export const sendContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body as ContactInput
  await sendContactEmail(name, email, message)
  res.status(200).json(success('Your message has been sent. We will get back to you soon.'))
})
