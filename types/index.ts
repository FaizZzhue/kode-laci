export type User = {
    id: string
    username: string
    email: string
    avatar_url: string | null
    created_at: string
}

export type AuthPayload = {
    id: string
    email: string
}

export type ApiResponse<T> = {
    success?: boolean
    message?: string
    data?: T
    error?: string
}