import axios from "axios";
import { authStorage } from "@/lib/auth-storage";

let isRedirecting = false;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Tangani 401 dari endpoint terproteksi (kecuali cek sesi /auth/me di halaman publik).
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl: string = error.config?.url ?? "";
        const isSessionProbe = requestUrl.includes("/auth/me");

        if (
            typeof window !== "undefined" &&
            status === 401 &&
            !isSessionProbe &&
            !isRedirecting &&
            window.location.pathname !== "/login"
        ) {
            isRedirecting = true;
            authStorage.clear();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
