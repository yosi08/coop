import fs from "fs";
import path from "path";
import type { Recommendation } from "../types";
import { getDedupeKey } from "./dedup";

// Next.js 서버 런타임 전용 (Server Components / Server Actions에서만 import)
const DATA_FILE = path.join(process.cwd(), "data", "recommendations.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function readAll(): Recommendation[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Recommendation[];
}

function writeAll(items: Recommendation[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

/**
 * 새 추천을 추가합니다.
 * 같은 name + flavor 조합이 이미 존재하면 null을 반환 (중복 거부).
 */
export function addRecommendation(
  data: Omit<Recommendation, "id" | "createdAt">
): { added: Recommendation } | { duplicate: Recommendation } {
  const items = readAll();
  const newKey = getDedupeKey(data.name, data.flavor);

  const existing = items.find(
    (item) => getDedupeKey(item.name, item.flavor) === newKey
  );

  if (existing) {
    return { duplicate: existing };
  }

  const newItem: Recommendation = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeAll([...items, newItem]);
  return { added: newItem };
}

export function deleteRecommendation(id: string): boolean {
  const items = readAll();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeAll(filtered);
  return true;
}
