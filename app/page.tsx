import RecommendationForm from "./components/RecommendationForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold text-zinc-900">매점 재고 추천</h1>
          <p className="mt-1 text-sm text-zinc-500">
            원하는 상품을 추천해주세요. 같은 상품·맛은 중복 등록되지 않습니다.
          </p>
        </div>

        <RecommendationForm />

      </div>
    </main>
  );
}
