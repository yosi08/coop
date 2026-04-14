"use client";

import { useActionState, useState } from "react";
import { addRecommendationAction, type AddResult } from "../actions";
import FoodSearchInput from "./FoodSearchInput";
import type { NutritionInfo } from "../lib/nutrition";

export default function RecommendationForm() {
  const [result, formAction, isPending] = useActionState<AddResult | null, FormData>(
    addRecommendationAction,
    null
  );
  const [selected, setSelected] = useState<NutritionInfo | null>(null);
  const [name, setName] = useState("");

  function handleSelect(info: NutritionInfo) {
    setName(info.productName);
    setSelected(info);
  }

  function handleReset() {
    setSelected(null);
    setName("");
  }

  const isUnsafe = selected?.judgment.result === "unsafe";

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-800">재고 추천 등록</h2>

      {/* 등록 결과 메시지 */}
      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            result.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.success ? result.message : result.error}
        </div>
      )}

      {/* 1단계: 식품안전나라 검색 */}
      <FoodSearchInput onSelect={handleSelect} />

      {!selected && (
        <p className="text-xs text-zinc-400 text-center py-2">
          위에서 상품을 검색하고 선택해주세요.
        </p>
      )}

      {selected && (
        <>
          <NutritionCard info={selected} onReset={handleReset} />

          {isUnsafe ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-4 text-sm text-red-700 text-center font-medium">
              고열량·저영양 기준 부적합 상품은 추천할 수 없습니다.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {/* 상품명 */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-600" htmlFor="name">
                    상품명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* 추천자 */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-600" htmlFor="submittedBy">
                    추천자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="submittedBy"
                    name="submittedBy"
                    type="text"
                    required
                    placeholder="이름 또는 닉네임"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* 추천 이유 */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-600" htmlFor="reason">
                    추천 이유 <span className="text-zinc-400 font-normal">(선택)</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={2}
                    placeholder="왜 이 상품을 추천하는지 알려주세요."
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-1 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors self-end"
              >
                {isPending ? "등록 중..." : "추천 등록"}
              </button>
            </>
          )}
        </>
      )}
    </form>
  );
}

function NutritionCard({ info, onReset }: { info: NutritionInfo; onReset: () => void }) {
  const j = info.judgment;
  const borderClass =
    j.result === "safe"
      ? "border-green-200 bg-green-50 text-green-800"
      : j.result === "unsafe"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${borderClass}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{info.productName}</span>
          <span className={`rounded-full text-xs px-2 py-0.5 font-semibold border ${borderClass}`}>
            {j.result === "safe" ? "✓ 적합" : j.result === "unsafe" ? "✗ 부적합" : "판정불가"}
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-zinc-600 underline shrink-0"
        >
          다시 검색
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs">
        <span>열량 <strong>{info.calories}kcal</strong></span>
        <span>나트륨 <strong>{info.sodium}mg</strong></span>
        <span>당류 <strong>{info.sugar}g</strong></span>
        <span>포화지방 <strong>{info.saturatedFat}g</strong></span>
      </div>
      {j.result === "unsafe" && (
        <ul className="mt-2 list-disc list-inside text-xs space-y-0.5 text-red-700">
          {j.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
      <p className="mt-1.5 text-xs opacity-60">{info.manufacturer} · {info.foodType} · 1회 {info.servingSize}g</p>
    </div>
  );
}
