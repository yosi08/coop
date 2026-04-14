import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_PREFIX = "/aowjaqnwjsdydrhdrks";
const LOGIN_PATH = "/aowjaqnwjsdydrhdrks/login";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(LOGIN_PATH)) return NextResponse.next();

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/aowjaqnwjsdydrhdrks/:path*"],
};
