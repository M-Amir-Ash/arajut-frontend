const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = configuredBaseUrl?.replace(/\/$/, '') || ''

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

const messages = {
  401: 'Sesi kamu sudah berakhir. Silakan masuk kembali.',
  403: 'Kamu tidak memiliki izin untuk melakukan tindakan ini.',
  404: 'Data yang kamu cari tidak ditemukan.',
  422: 'Data yang dikirim belum valid. Periksa kembali formulir.',
  500: 'Server sedang mengalami gangguan. Silakan coba lagi nanti.',
  429: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) throw new ApiError('Alamat API belum dikonfigurasi.')

  const token = localStorage.getItem('arajut-api-token') || sessionStorage.getItem('arajut-api-token')
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, '')}`, { credentials: 'include', ...options, headers })
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server Arajut. Periksa koneksi dan coba lagi.')
  }

  const contentType = response.headers.get('content-type') || ''
  const hasBody = response.status !== 204 && response.status !== 205
  const payload = hasBody && contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('arajut-api-token')
      sessionStorage.removeItem('arajut-api-token')
      window.dispatchEvent(new CustomEvent('arajut:unauthenticated'))
    }
    throw new ApiError(payload?.message || messages[response.status] || 'Permintaan tidak dapat diproses.', response.status, payload?.errors || null)
  }

  return payload
}
