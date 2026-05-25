import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ApiError } from '../utils/ApiError'

type ValidateTarget = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const messages = result.error.issues
        .map(e => `${e.path.map(String).join('.')}: ${e.message}`)
        .join(', ')
      return next(new ApiError(422, messages))
    }
    if (target === 'body') {
      req.body = result.data
    } else if (target === 'params') {
      req.params = result.data as typeof req.params
    }
    // For 'query', Express 5 makes req.query read-only; validated data stays accessible via req.query since we parsed from it
    next()
  }
}
