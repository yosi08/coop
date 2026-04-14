"use server";

import { revalidatePath } from "next/cache";
import { addRecommendation, deleteRecommendation } from "./lib/store";

export type AddResult =
  | { success: true; message: string }
  | { success: false; duplicate: true; existingName: string; existingFlavor: string }
  | { success: false; error: string };

export async function addRecommendationAction(
  _prev: AddResult | null,
  formData: FormData
): Promise<AddResult> {
  const name = (formData.get("name") as string)?.trim();
  const submittedBy = (formData.get("submittedBy") as string)?.trim() ?? "";
  const reason = (formData.get("reason") as string)?.trim() ?? "";

  if (!name) return { success: false, error: "상품명을 입력해주세요." };
  if (!submittedBy) return { success: false, error: "추천자를 입력해주세요." };

  const result = await addRecommendation({
    name,
    flavor: "",
    reason: reason || undefined,
    submittedBy,
  });

  if ("duplicate" in result) {
    return {
      success: false,
      duplicate: true,
      existingName: result.duplicate.name,
      existingFlavor: result.duplicate.flavor,
    };
  }

  revalidatePath("/");
  return { success: true, message: `"${name}" 추천이 등록되었습니다.` };
}

export async function deleteRecommendationAction(id: string): Promise<void> {
  await deleteRecommendation(id);
  revalidatePath("/");
}
