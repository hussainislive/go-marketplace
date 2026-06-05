import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'
import type { ContactValues } from '../utils/validation'

export function useSendContact() {
  return useMutation({
    mutationFn: async (payload: ContactValues) => {
      await api.post('/contact', payload)
    },
  })
}
