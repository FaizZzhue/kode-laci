import { getAuthCookieOptions } from "@/lib/auth";
import { okResponse } from "@/lib/api-response";

export async function POST() {
    const response = okResponse(null, {
        message: "Logout berhasil",
        status: 200,
    });

    response.cookies.set({
        ...getAuthCookieOptions(0),
        value: "",
    });

    return response;
}
