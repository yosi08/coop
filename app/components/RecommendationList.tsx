"use client";

import { useTransition } from "react";
import type { GroupedRecommendation } from "../types";
import { deleteByKeyAction } from "../actions";

interface Props {
  items: GroupedRecommendation[];
}

export default function RecommendationList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400 text-sm">
        아직 등록된 추천이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <RecommendationCard key={item.key} item={item} />
      ))}
    </div>
  );
}

function RecommendationCard({ item }: { item: GroupedRecommendation }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteByKeyAction(item.key);
    });
  }

  return (
    <div
      className={`bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-start justify-between gap-4 transition-opacity ${
        isPending ? "opacity-40" : ""
      }`}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-zinc-800 text-base">{item.name}</span>
          {/* 카운트 */}
          <span className="text-sm font-medium" style={{ color: "#4d4dff" }}>{item.count}</span>
          {item.flavor && (
            <span className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-medium">
              {item.flavor}
            </span>
          )}
        </div>

        {item.submitters.length > 0 && (
          <p className="text-xs text-zinc-500 mt-0.5">
            추천: {item.submitters.join(", ")}
          </p>
        )}

        {item.reasons.length > 0 && (
          <ul className="mt-0.5 space-y-0.5">
            {item.reasons.map((r, i) => (
              <li key={i} className="text-xs text-zinc-400 truncate">
                &ldquo;{r}&rdquo;
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-zinc-400 mt-1">
          {new Date(item.latestCreatedAt).toLocaleDateString("ko-KR")}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={isPending}
        aria-label="삭제"
        className="shrink-0 text-zinc-400 hover:text-red-500 disabled:opacity-30 transition-colors text-lg leading-none"
      >
        ✕
      </button>
    </div>
  );
}
