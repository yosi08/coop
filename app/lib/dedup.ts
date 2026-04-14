import type { Recommendation, DedupeKey, GroupedRecommendation } from "../types";

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getDedupeKey(name: string, flavor: string): DedupeKey {
  const normalizedFlavor = normalize(flavor);
  const emptyFlavors = ["", "없음", "기본", "default", "plain", "original"];
  const flavorKey = emptyFlavors.includes(normalizedFlavor)
    ? "__none__"
    : normalizedFlavor;
  return `${normalize(name)}::${flavorKey}`;
}

export function groupRecommendations(items: Recommendation[]): GroupedRecommendation[] {
  const map = new Map<DedupeKey, Recommendation[]>();

  for (const item of items) {
    const key = getDedupeKey(item.name, item.flavor);
    const group = map.get(key) ?? [];
    group.push(item);
    map.set(key, group);
  }

  const grouped: GroupedRecommendation[] = [];

  for (const [key, group] of map) {
    const sorted = [...group].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    grouped.push({
      key,
      name: sorted[0].name,
      flavor: sorted[0].flavor,
      count: group.length,
      submitters: group.map((i) => i.submittedBy ?? "").filter(Boolean),
      reasons: group.map((i) => i.reason ?? "").filter(Boolean),
      latestCreatedAt: sorted[0].createdAt,
      ids: group.map((i) => i.id),
    });
  }

  // 카운트 내림차순, 동일하면 최신순
  grouped.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime();
  });

  return grouped;
}
