"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { authStorage } from "@/lib/auth-storage";
import { fetchCurrentUser, logoutRequest } from "@/lib/snippet-api";
import type { AuthContextValue, ChildrenProps, User } from "@/types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: ChildrenProps) {
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
            await logoutRequest();
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
