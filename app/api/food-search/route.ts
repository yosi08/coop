import { NextRequest, NextResponse } from "next/server";
import type { FoodApiRow } from "../../lib/nutrition";
import { toNutritionInfo } from "../../lib/nutrition";

export const revalidate = 86400; // 24시간 라우트 캐시

const API_KEY = process.env.FOOD_SAFETY_API_KEY ?? "";
const BASE = "https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02";

// GET /api/food-search?q=포카칩  → 이름 검색 (최대 10건)
export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "FOOD_SAFETY_API_KEY 환경 변수가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "q 파라미터가 필요합니다." }, { status: 400 });
  }

  const url = new URL(BASE);
  url.searchParams.set("serviceKey", API_KEY);
  url.searchParams.set("FOOD_NM_KR", query);
  url.searchParams.set("numOfRows", "10");
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("type", "json");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });

    if (!res.ok) {
      return NextResponse.json({ error: "API 호출 실패" }, { status: 502 });
    }

    const json = await res.json();

    // 결과 없음
    const items: FoodApiRow[] = json?.body?.items ?? [];
    if (items.length === 0) {
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results: items.map(toNutritionInfo) });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
