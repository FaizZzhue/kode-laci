import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_SERVICE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);