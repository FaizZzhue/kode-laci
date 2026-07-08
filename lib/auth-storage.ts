import { STORAGE_KEYS } from '@/constants/storage'

export const authStorage = {
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN)
    },

    setToken(token: string) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    },

    removeToken() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
    },
}