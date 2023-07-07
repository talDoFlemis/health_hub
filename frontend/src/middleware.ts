import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { Roles } from "./utils/constants";

export default withAuth(
  function middleware(req) {
    const { nextUrl, nextauth } = req;
    const { pathname } = nextUrl;
    const { token } = nextauth;
    if (token?.role === Roles.Patient && pathname !== "/my-appointments") {
      return NextResponse.redirect(new URL("/my-appointments", req.url));
    }
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/api") && !token) {
      return NextResponse.json({ message: "unauthenticated" }, { status: 401 });
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) =>
        !!token ||
        req.nextUrl.pathname.startsWith("/api") ||
        req.nextUrl.pathname.startsWith("/login"),
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
