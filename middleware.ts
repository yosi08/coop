import { NextRequest, NextResponse } from "next/server";

const COOKIE = "admin_auth";
const SECRET_PATH = "/aowjaqnwjsdydrhdrks";
const LOGIN_PATH = "/aowjaqnwjsdydrhdrks/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(LOGIN_PATH)) return NextResponse.next();

  if (pathname.startsWith(SECRET_PATH)) {
    const token = req.cookies.get(COOKIE)?.value;
    const expected = process.env.ADMIN_PASSWORD;

    if (!token || token !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/aowjaqnwjsdydrhdrks/:path*"],
};
