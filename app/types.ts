export interface Recommendation {
  id: string;
  name: string;       // 상품명 (예: 포카칩)
  flavor: string;     // 맛/종류 (예: 오리지널, 어니언) — 빈 문자열이면 맛 없음
  reason?: string;    // 추천 이유 (선택)
  submittedBy?: string; // 추천자 (선택)
  createdAt: string;  // ISO 8601
}

// 중복 제거 기준: name + flavor 조합 (대소문자 무시, 공백 무시)
export type DedupeKey = string; // `${normalizedName}::${normalizedFlavor}`

export interface DedupeResult {
  unique: Recommendation[];
  duplicates: Array<{ kept: Recommendation; removed: Recommendation[] }>;
}
