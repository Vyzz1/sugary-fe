import api from "@/lib/axios";
import {
  buildCreateMealPayload,
  buildUpdateMealPayload,
  buildUploadFileName,
  extractPublicUrl,
  type MealType,
  type UpdateMealRequestPayload,
} from "./add-meal.helpers";
import type { BaseResponse } from "@/types/api";
import type { RecentMealsResponse, TodayMeal } from "../-queries/today.query";

interface UploadImageResponse extends BaseResponse<{
  message: string;
  issued_at: string;
  folder: string;
  public_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}> {
  request_id?: string;
}

interface CreateMealResponse extends BaseResponse<TodayMeal> {
  request_id?: string;
}

interface DeleteMealResponse extends BaseResponse<{
  id: number;
}> {
  request_id?: string;
}

interface UpdateMealResponse extends BaseResponse<TodayMeal> {
  request_id?: string;
}

interface UpdateMealAnalysisResponse extends BaseResponse<TodayMeal["analysis"]> {
  request_id?: string;
}

export async function uploadMealImage(input: {
  file: File;
  dish_name?: string;
  meal_type: MealType;
  recorded_at?: string;
}) {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append(
    "file_name",
    buildUploadFileName({
      dish_name: input.dish_name,
      meal_type: input.meal_type,
      recorded_at: input.recorded_at,
    })
  );

  const response = await api.post<UploadImageResponse>("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return extractPublicUrl(response.data);
}

export async function createMeal(payload: {
  dish_name?: string;
  meal_type: MealType;
  recorded_at?: string;
  image_url?: string;
  source_meal_id?: number;
}) {
  const response = await api.post<CreateMealResponse>(
    "/api/meals",
    buildCreateMealPayload(payload)
  );
  return response.data.data;
}

export async function getRecentMeals(params?: { q?: string }) {
  const response = await api.get<RecentMealsResponse>("/api/meals/recent", {
    params,
  });

  return response.data.data;
}

export async function deleteMeal(mealId: number) {
  const response = await api.delete<DeleteMealResponse>(`/api/meals/${mealId}`);
  return response.data.data;
}

export async function updateMeal(mealId: number, payload: UpdateMealRequestPayload) {
  const response = await api.patch<UpdateMealResponse>(
    `/api/meals/${mealId}`,
    buildUpdateMealPayload(payload)
  );
  return response.data.data;
}

export async function updateMealAnalysis(
  mealId: number,
  payload: {
    estimated_sugar_grams: number;
    estimated_carbs_grams: number;
    estimated_protein_grams: number;
    estimated_calories: number;
  }
) {
  const response = await api.patch<UpdateMealAnalysisResponse>(`/api/meals/${mealId}/analysis`, payload);
  return response.data.data;
}
