"use server";

import { revalidatePath } from "next/cache";
import { addRecommendation, deleteByKey } from "./lib/store";

export type AddResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function addRecommendationAction(
  _prev: AddResult | null,
  formData: FormData
): Promise<AddResult> {
  const name = (formData.get("name") as string)?.trim();
  const submittedBy = (formData.get("submittedBy") as string)?.trim() ?? "";
  const reason = (formData.get("reason") as string)?.trim() ?? "";
  const judgmentResult = (formData.get("judgmentResult") as string)?.trim();

  if (!name) return { success: false, error: "상품명을 입력해주세요." };
  if (!submittedBy) return { success: false, error: "추천자를 입력해주세요." };
  if (judgmentResult === "unknown") return { success: false, error: "판정불가 상품은 추천할 수 없습니다." };
  if (judgmentResult === "unsafe") return { success: false, error: "고열량·저영양 기준 부적합 상품은 추천할 수 없습니다." };

  await addRecommendation({
    name,
    flavor: "",
    reason: reason || undefined,
    submittedBy,
  });

  revalidatePath("/");
  return { success: true, message: `"${name}" 추천이 등록되었습니다.` };
}

export async function deleteByKeyAction(key: string): Promise<void> {
  await deleteByKey(key);
  revalidatePath("/aowjaqnwjsdydrhdrks");
}
