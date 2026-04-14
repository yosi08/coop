import { readAll } from "../lib/store";
import { deduplicate } from "../lib/dedup";
import RecommendationList from "../components/RecommendationList";

export default async function AdminPage() {
  const all = readAll();
  const { unique, duplicates } = deduplicate(all);

  return (
    <main className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold text-zinc-900">재고 추천 확인</h1>
          <p className="mt-1 text-sm text-zinc-500">
            접수된 재고 추천 목록입니다.
          </p>
        </div>

        {/* 중복 제거 알림 */}
        {duplicates.length > 0 && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            <p className="font-semibold mb-1">중복 항목 처리됨 ({duplicates.length}건)</p>
            <ul className="list-disc list-inside space-y-0.5 text-yellow-700">
              {duplicates.map(({ kept, removed }) => (
                <li key={kept.id}>
                  <span className="font-medium">
                    {kept.name}{kept.flavor ? ` (${kept.flavor})` : ""}
                  </span>
                  {" "}— {removed.length}개 중복 제거됨
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 추천 목록 */}
        <section>
          <h2 className="text-base font-semibold text-zinc-700 mb-3">
            추천 목록
            <span className="ml-2 text-sm font-normal text-zinc-400">
              {unique.length}개
            </span>
          </h2>
          <RecommendationList items={unique} />
        </section>

      </div>
    </main>
  );
}
