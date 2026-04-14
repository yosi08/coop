import { Redis } from "@upstash/redis";
import type { Recommendation } from "../types";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = "recommendations";

export async function readAll(): Promise<Recommendation[]> {
  const data = await redis.get<Recommendation[]>(KEY);
  return data ?? [];
}

async function writeAll(items: Recommendation[]): Promise<void> {
  await redis.set(KEY, items);
}

export async function addRecommendation(
  data: Omit<Recommendation, "id" | "createdAt">
): Promise<Recommendation> {
  const items = await readAll();
  const newItem: Recommendation = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await writeAll([...items, newItem]);
  return newItem;
}

export async function deleteByKey(key: string): Promise<boolean> {
  const { getDedupeKey } = await import("./dedup");
  const items = await readAll();
  const filtered = items.filter(
    (item) => getDedupeKey(item.name, item.flavor) !== key
  );
  if (filtered.length === items.length) return false;
  await writeAll(filtered);
  return true;
}
