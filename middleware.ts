import { NextRequest, NextResponse } from "next/server";

const COOKIE = "admin_auth";
const LOGIN_PATH = "/admin/login";
const ADMIN_PATH = "/admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지는 통과
  if (pathname.startsWith(LOGIN_PATH)) return NextResponse.next();

  // /admin 이하 경로만 검사
  if (pathname.startsWith(ADMIN_PATH)) {
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
  matcher: ["/admin/:path*"],
};
