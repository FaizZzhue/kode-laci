import { STORAGE_KEYS } from "@/constants/storage";
import api from "@/lib/api";
import { ApiResponse, User } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const login = useCallback((token: string, user: User) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

        setToken(token)
        setUser(user)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)

        setToken(null)
        setUser(null)
        
        window.location.href= '/login'
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)

                if (!storedToken) {
                    setIsLoading(false)
                    return
                }

                setToken(storedToken)

                const response = await api.get<ApiResponse<User>>('/auth/me')

                if (response.data.data) {
                    const currentUser = response.data.data

                    setUser(currentUser)
                    localStorage.setItem('user', JSON.stringify(currentUser))
                } else {
                    logout()
                }
            } catch {
                logout()
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [logout])

    return { user, token, isLoading, login, logout, isAuthenticated: !!user && !!token }
}