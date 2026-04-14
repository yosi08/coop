"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, isPending] = useActionState<string | null, FormData>(
    loginAction,
    null
  );

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">관리자 로그인</h1>
          <p className="mt-1 text-sm text-zinc-500">재고 확인 페이지에 접근하려면 비밀번호가 필요합니다.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-600" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="비밀번호 입력"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </main>
  );
}
