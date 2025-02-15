import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await supabase.auth.getSession();
  const url = req.nextUrl;

  // If not logged in, redirect to login
  if (!session.data.session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Get user role from database
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.data.session.user.id)
    .single();

  const userRole = userData?.role;

  // Redirect based on role
  if (url.pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (url.pathname.startsWith("/dashboard") && userRole !== "client") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
