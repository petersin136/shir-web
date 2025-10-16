import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Restrict middleware to protected sections only
    "/protected/:path*",
    "/manage/:path*",
  ],
};
