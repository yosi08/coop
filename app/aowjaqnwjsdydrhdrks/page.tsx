import { readAll } from "../lib/store";
import { groupRecommendations } from "../lib/dedup";
import RecommendationList from "../components/RecommendationList";

export default async function AdminPage() {
  const all = await readAll();
  const grouped = groupRecommendations(all);

  return (
    <main className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold text-zinc-900">재고 추천 확인</h1>
          <p className="mt-1 text-sm text-zinc-500">
            추천 수가 많을수록 상단에 표시됩니다.
          </p>
        </div>

        <section>
          <h2 className="text-base font-semibold text-zinc-700 mb-3">
            추천 목록
            <span className="ml-2 text-sm font-normal text-zinc-400">
              {grouped.length}개
            </span>
          </h2>
          <RecommendationList items={grouped} />
        </section>

      </div>
    </main>
  );
}
