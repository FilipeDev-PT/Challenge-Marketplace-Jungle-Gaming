import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/shared/api/errors'
import { apiErrorSchema } from '@/shared/api/contracts'
import { whenMocksReady } from '@/shared/lib/mocks-ready'
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  await whenMocksReady()
  const token = localStorage.getItem('kurio:token')
  const guestId = localStorage.getItem('kurio:guestId')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (guestId) {
    config.headers['X-Guest-Id'] = guestId
  }
  const scenario = sessionStorage.getItem('kurio:scenario')
  if (scenario) {
    config.headers['X-Mock-Scenario'] = scenario
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }
    const data = error.response?.data
    const parsed = apiErrorSchema.safeParse(data)
    if (parsed.success) {
      return Promise.reject(
        new ApiError({
          code: parsed.data.code,
          message: parsed.data.message,
          status: error.response?.status ?? 500,
          fields: parsed.data.fields,
        }),
      )
    }
    if (!error.response) {
      return Promise.reject(
        new ApiError({
          code: 'transient',
          message: 'Falha de conexão. Tente novamente.',
          status: 0,
        }),
      )
    }
    return Promise.reject(
      new ApiError({
        code: 'transient',
        message: error.message || 'Erro inesperado',
        status: error.response.status,
      }),
    )
  },
)
