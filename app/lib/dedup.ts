import type { Recommendation, DedupeKey, DedupeResult } from "../types";

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getDedupeKey(name: string, flavor: string): DedupeKey {
  // 맛이 없는 경우("", "없음", "기본") 은 동일하게 취급
  const normalizedFlavor = normalize(flavor);
  const emptyFlavors = ["", "없음", "기본", "default", "plain", "original"];
  const flavorKey = emptyFlavors.includes(normalizedFlavor)
    ? "__none__"
    : normalizedFlavor;
  return `${normalize(name)}::${flavorKey}`;
}

/**
 * 추천 목록에서 중복을 제거합니다.
 * - name + flavor 조합이 같으면 중복으로 판단
 * - 중복 시 가장 최신 항목을 유지
 */
export function deduplicate(items: Recommendation[]): DedupeResult {
  const map = new Map<DedupeKey, Recommendation[]>();

  for (const item of items) {
    const key = getDedupeKey(item.name, item.flavor);
    const group = map.get(key) ?? [];
    group.push(item);
    map.set(key, group);
  }

  const unique: Recommendation[] = [];
  const duplicates: DedupeResult["duplicates"] = [];

  for (const [, group] of map) {
    if (group.length === 1) {
      unique.push(group[0]);
    } else {
      // 최신 항목 기준으로 유지
      const sorted = [...group].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      unique.push(sorted[0]);
      duplicates.push({ kept: sorted[0], removed: sorted.slice(1) });
    }
  }

  // createdAt 기준 최신순 정렬
  unique.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { unique, duplicates };
}
