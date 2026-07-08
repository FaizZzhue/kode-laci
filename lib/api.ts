import { STORAGE_KEYS } from '@/constants/storage'
import axios from 'axios'

const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
let isRedirecting = false

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Menambahkan Authorization header jika token tersedia.
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle global error, khususnya token yang sudah tidak valid.
api.interceptors.response.use(
    (response) => response,
    (error) => {        
        if (typeof window !== 'undefined' && error.response?.status === 401 && !isRedirecting) {
            isRedirecting = true

            localStorage.removeItem(STORAGE_KEYS.TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER)

            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api;