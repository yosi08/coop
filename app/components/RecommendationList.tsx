"use client";

import { useTransition } from "react";
import type { Recommendation } from "../types";
import { deleteRecommendationAction } from "../actions";

interface Props {
  items: Recommendation[];
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
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function RecommendationCard({ item }: { item: Recommendation }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteRecommendationAction(item.id);
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
          {item.flavor && (
            <span className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-medium">
              {item.flavor}
            </span>
          )}
        </div>
        {item.reason && (
          <p className="text-sm text-zinc-500 mt-0.5 truncate">{item.reason}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
          {item.submittedBy && <span>추천: {item.submittedBy}</span>}
          <span>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</span>
        </div>
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
