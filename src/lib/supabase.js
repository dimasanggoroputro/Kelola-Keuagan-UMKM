import { createClient } from "@supabase/supabase-js";
import { getGuestId } from "@/lib/guest-id";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// getGuestId() calls localStorage — only safe in the browser.
// On SSR (server-side render) we omit the header gracefully.
const guestId = typeof window !== "undefined" ? getGuestId() : undefined;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    // "x-guest-id" must match the name used in the RLS policy:
    //   current_setting('request.headers', true)::json->>'x-guest-id'
    headers: guestId ? { "x-guest-id": guestId } : {},
  },
});
