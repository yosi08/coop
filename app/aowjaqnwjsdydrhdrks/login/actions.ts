"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prev: string | null,
  formData: FormData
): Promise<string> {
  const password = (formData.get("password") as string)?.trim();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) return "서버 설정 오류: ADMIN_PASSWORD가 설정되지 않았습니다.";
  if (!password) return "비밀번호를 입력해주세요.";
  if (password !== expected) return "비밀번호가 올바르지 않습니다.";

  const cookieStore = await cookies();
  cookieStore.set("admin_auth", expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // 브라우저 세션 동안 유지 (maxAge 미설정)
  });

  redirect("/aowjaqnwjsdydrhdrks");
}
