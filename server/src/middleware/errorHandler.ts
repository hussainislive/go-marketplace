import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import logger from '../utils/logger'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    logger.warn({ statusCode: err.statusCode, message: err.message })
    res.status(err.statusCode).json({ success: false, message: err.message })
    return
  }

  const errMsg = err instanceof Error ? err.message : String(err)
  const errStack = err instanceof Error ? err.stack : undefined
  logger.error({ message: 'Unhandled error', error: errMsg, stack: errStack })
  res.status(500).json({ success: false, message: 'Internal Server Error' })
}
