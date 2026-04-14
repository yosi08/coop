export interface Recommendation {
  id: string;
  name: string;       // 상품명 (예: 포카칩)
  flavor: string;     // 맛/종류 (예: 오리지널, 어니언) — 빈 문자열이면 맛 없음
  reason?: string;    // 추천 이유 (선택)
  submittedBy?: string; // 추천자 (선택)
  createdAt: string;  // ISO 8601
}

export type DedupeKey = string; // `${normalizedName}::${normalizedFlavor}`

export interface GroupedRecommendation {
  key: DedupeKey;
  name: string;
  flavor: string;
  count: number;
  submitters: string[];
  reasons: string[];
  latestCreatedAt: string;
  ids: string[];
}
