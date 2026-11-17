import { STORAGE_KEYS } from "@/constants/storage";
import type { User } from "@/types";

const isBrowser = () => typeof window !== "undefined";

export const authStorage = {
    getUser(): User | null {
        if (!isBrowser()) return null;
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        if (!raw) return null;

        try {
            return JSON.parse(raw) as User;
        } catch {
            localStorage.removeItem(STORAGE_KEYS.USER);
            return null;
        }
    },

    setUser(user: User) {
        if (!isBrowser()) return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    clear() {
        if (!isBrowser()) return;
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },
};
