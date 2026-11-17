"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { authStorage } from "@/lib/auth-storage";
import type { ApiResponse, User } from "@/types";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setSessionUser: (user: User) => void;
    logout: (redirect?: boolean) => Promise<void>;
    refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<User | null> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setSessionUser = useCallback((nextUser: User) => {
        authStorage.setUser(nextUser);
        setUser(nextUser);
        setIsLoading(false);
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const currentUser = await fetchCurrentUser();
            if (currentUser) {
                authStorage.setUser(currentUser);
                setUser(currentUser);
            } else {
                authStorage.clear();
                setUser(null);
            }
        } catch {
            authStorage.clear();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async (redirect = true) => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Abaikan error jaringan saat membersihkan sesi lokal.
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

        fetchCurrentUser()
            .then((currentUser) => {
                if (!active) return;
                if (currentUser) {
                    authStorage.setUser(currentUser);
                    setUser(currentUser);
                } else {
                    authStorage.clear();
                    setUser(null);
                }
            })
            .catch(() => {
                if (!active) return;
                authStorage.clear();
                setUser(null);
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                setSessionUser,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
