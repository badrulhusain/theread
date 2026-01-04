import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Role-based authorization
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isPathProtected = req.nextUrl.pathname.startsWith("/dashboard");
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    if (isPathProtected && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAdminPath && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
