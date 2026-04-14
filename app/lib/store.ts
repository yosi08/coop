import { Redis } from "@upstash/redis";
import type { Recommendation } from "../types";
import { getDedupeKey } from "./dedup";

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
): Promise<{ added: Recommendation } | { duplicate: Recommendation }> {
  const items = await readAll();
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

  await writeAll([...items, newItem]);
  return { added: newItem };
}

export async function deleteRecommendation(id: string): Promise<boolean> {
  const items = await readAll();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  await writeAll(filtered);
  return true;
}
