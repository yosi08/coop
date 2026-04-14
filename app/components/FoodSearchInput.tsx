"use client";

import { useState, useRef } from "react";
import type { NutritionInfo } from "../lib/nutrition";

interface Props {
  onSelect: (info: NutritionInfo) => void;
}

export default function FoodSearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function search(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "검색 실패");
        setResults([]);
      } else {
        setResults(data.results);
      }
    } catch {
      setError("네트워크 오류");
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setSearched(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => search(value.trim()), 300);
  }

  function handleSelect(info: NutritionInfo) {
    onSelect(info);
    setResults([]);
    setQuery("");
    setSearched(false);
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <p className="text-sm font-semibold text-blue-800">식품안전나라 상품 검색</p>
      <p className="text-xs text-blue-600">
        상품명을 입력하면 영양성분과 적합 여부가 자동으로 채워집니다.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        placeholder="상품명 입력 (2자 이상, 예: 포카칩)"
        className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading && <p className="text-xs text-blue-500">검색 중...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {searched && !loading && !error && results.length === 0 && (
        <p className="text-xs text-zinc-500">검색 결과가 없습니다.</p>
      )}

      {results.length > 0 && (
        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {results.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left rounded-lg border border-zinc-200 bg-white px-3 py-2.5 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-medium text-sm text-zinc-800">{item.productName}</span>
                  <JudgmentBadge judgment={item.judgment} />
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {item.manufacturer} · {item.foodType}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  열량 {item.calories}kcal · 나트륨 {item.sodium}mg · 당류 {item.sugar}g · 포화지방 {item.saturatedFat}g
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JudgmentBadge({ judgment }: { judgment: NutritionInfo["judgment"] }) {
  if (judgment.result === "safe") {
    return (
      <span className="rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium shrink-0">
        ✓ 적합
      </span>
    );
  }
  if (judgment.result === "unsafe") {
    return (
      <span className="rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5 font-medium shrink-0">
        ✗ 부적합
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 font-medium shrink-0">
      판정불가
    </span>
  );
}
