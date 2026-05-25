export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponseShape<T> {
  success: boolean
  message: string
  data?: T
  meta?: PaginationMeta
}

export function success<T>(
  message: string,
  data?: T,
  meta?: PaginationMeta
): ApiResponseShape<T> {
  return { success: true, message, data, meta }
}

export function paginated<T>(
  message: string,
  data: T[],
  total: number,
  page: number,
  limit: number
): ApiResponseShape<T[]> {
  return {
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
