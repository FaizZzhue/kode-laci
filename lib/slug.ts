import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const MAX_SLUG_ATTEMPTS = 5;

export async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title);

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
        const candidate = `${baseSlug}-${nanoid(6).toLowerCase()}`;

        const { data, error } = await supabase
            .from("snippets")
            .select("id")
            .eq("slug", candidate)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            return candidate;
        }
    }

    throw new Error("Failed to generate unique slug");
}
