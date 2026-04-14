// 공공데이터포털 식품영양성분DB API (apis.data.go.kr) 응답 원본 필드
export interface FoodApiRow {
  FOOD_NM_KR: string;    // 식품명
  FOOD_CAT1_NM: string;  // 식품대분류 (예: 과자류및스낵류, 음료류 등)
  MAKER_NM: string;      // 제조사명
  SERVING_SIZE: string;  // 1회 섭취참고량 (g 또는 ml)
  AMT_NUM1: string;      // 열량 (kcal)
  AMT_NUM3: string;      // 단백질 (g)
  AMT_NUM4: string;      // 지방 (g)
  AMT_NUM6: string;      // 탄수화물 (g)
  AMT_NUM7: string;      // 당류 (g)
  AMT_NUM13: string;     // 나트륨 (mg)
  AMT_NUM24: string;     // 포화지방산 (g)
  AMT_NUM25: string;     // 트랜스지방산 (g)
}

// 프론트에서 사용하는 정제된 형태
export interface NutritionInfo {
  productName: string;
  foodType: string;
  manufacturer: string;
  servingSize: number;    // g 또는 ml
  calories: number;       // kcal
  carbs: number;          // g
  protein: number;        // g
  fat: number;            // g
  sodium: number;         // mg
  sugar: number;          // g
  saturatedFat: number;   // g
  transFat: number;       // g
  judgment: HighCalLowNutrJudgment;
}

export type HighCalLowNutrJudgment =
  | { result: "safe"; label: "적합" }
  | { result: "unsafe"; label: "부적합"; reasons: string[] }
  | { result: "unknown"; label: "판정불가" };

/**
 * 고열량·저영양 식품 판정 (어린이 식생활안전관리 특별법 기준)
 *
 * 기준 1 — 과자·빵·초콜릿·아이스크림·면류(용기)·즉석식품 등:
 *   1회 제공량당 열량 500kcal 이상 이고 (나트륨 600mg 초과 또는 포화지방 4g 초과)
 *
 * 기준 2 — 음료류:
 *   1회 제공량당 열량 100kcal 이상 또는 당류 12g 초과
 */
export function judgeHighCalLowNutr(info: Omit<NutritionInfo, "judgment">): HighCalLowNutrJudgment {
  const type = info.foodType.toLowerCase();

  const isBeverage =
    type.includes("음료") ||
    type.includes("주스") ||
    type.includes("탄산") ||
    type.includes("유음료") ||
    type.includes("혼합음료");

  const isSnackGroup =
    type.includes("과자") ||
    type.includes("스낵") ||
    type.includes("빵") ||
    type.includes("초콜릿") ||
    type.includes("아이스크림") ||
    type.includes("빙과") ||
    type.includes("면류") ||
    type.includes("즉석") ||
    type.includes("만두") ||
    type.includes("소시지");

  if (isBeverage) {
    const reasons: string[] = [];
    if (info.calories >= 100) reasons.push(`열량 ${info.calories}kcal (기준: 100kcal 미만)`);
    if (info.sugar > 12) reasons.push(`당류 ${info.sugar}g (기준: 12g 이하)`);
    return reasons.length > 0
      ? { result: "unsafe", label: "부적합", reasons }
      : { result: "safe", label: "적합" };
  }

  if (isSnackGroup) {
    if (info.calories < 500) return { result: "safe", label: "적합" };
    const reasons: string[] = [];
    if (info.sodium > 600) reasons.push(`나트륨 ${info.sodium}mg (기준: 600mg 이하)`);
    if (info.saturatedFat > 4) reasons.push(`포화지방 ${info.saturatedFat}g (기준: 4g 이하)`);
    if (reasons.length === 0) return { result: "safe", label: "적합" };
    return {
      result: "unsafe",
      label: "부적합",
      reasons: [`열량 ${info.calories}kcal (기준: 500kcal 미만)`, ...reasons],
    };
  }

  return { result: "unknown", label: "판정불가" };
}

export function toNutritionInfo(row: FoodApiRow): NutritionInfo {
  const n = (v: string) => parseFloat(v) || 0;
  const base: Omit<NutritionInfo, "judgment"> = {
    productName: row.FOOD_NM_KR,
    foodType: row.FOOD_CAT1_NM ?? "",
    manufacturer: row.MAKER_NM ?? "",
    servingSize: n(row.SERVING_SIZE),
    calories: n(row.AMT_NUM1),
    protein: n(row.AMT_NUM3),
    fat: n(row.AMT_NUM4),
    carbs: n(row.AMT_NUM6),
    sugar: n(row.AMT_NUM7),
    sodium: n(row.AMT_NUM13),
    saturatedFat: n(row.AMT_NUM24),
    transFat: n(row.AMT_NUM25),
  };
  return { ...base, judgment: judgeHighCalLowNutr(base) };
}
