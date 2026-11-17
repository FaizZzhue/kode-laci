"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { authStorage } from "@/lib/auth-storage";
import type { ApiResponse, User } from "@/types";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setSessionUser = useCallback((nextUser: User) => {
        authStorage.setUser(nextUser);
        setUser(nextUser);
    }, []);

    const logout = useCallback(async (redirect = true) => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Abaikan kegagalan jaringan saat membersihkan state sesi lokal.
        } finally {
            authStorage.clear();
            setUser(null);

            if (redirect && typeof window !== "undefined" && window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
    }, []);

    useEffect(() => {
        let active = true;

        const initializeAuth = async () => {
            try {
                const response = await api.get<ApiResponse<User>>("/auth/me");
                const currentUser = response.data.data;

                if (!active) return;

                if (currentUser) {
                    authStorage.setUser(currentUser);
                    setUser(currentUser);
                } else {
                    authStorage.clear();
                    setUser(null);
                }
            } catch {
                if (!active) return;
                authStorage.clear();
                setUser(null);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        initializeAuth();

        return () => {
            active = false;
        };
    }, []);

    return {
        user,
        isLoading,
        setSessionUser,
        logout,
        isAuthenticated: !!user,
    };
}
