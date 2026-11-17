"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { extractApiError, loginRequest, registerRequest } from "@/lib/snippet-api";

export function useLoginForm(redirectParam: string | null) {
    const router = useRouter();
    const { setSessionUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const user = await loginRequest(email, password);
            setSessionUser(user);

            const safeRedirect =
                redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
                    ? redirectParam
                    : "/dashboard";

            router.push(safeRedirect);
        } catch (err) {
            setError(extractApiError(err, "Login gagal. Periksa email dan password Anda."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePassword: () => setShowPassword((prev) => !prev),
        error,
        isSubmitting,
        handleSubmit,
    };
}

export function useRegisterForm() {
    const router = useRouter();
    const { setSessionUser } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const user = await registerRequest(username, email, password);
            setSessionUser(user);
            router.push("/dashboard");
        } catch (err) {
            setError(extractApiError(err, "Registrasi gagal. Silakan periksa input Anda."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        togglePassword: () => setShowPassword((prev) => !prev),
        error,
        isSubmitting,
        handleSubmit,
    };
}
