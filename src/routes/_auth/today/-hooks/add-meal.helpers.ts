import type { TodayMeal } from "../-queries/today.query";

export type MealType = TodayMeal["meal_type"];

export interface CreateMealRequestPayload {
  dish_name?: string;
  meal_type: MealType;
  recorded_at?: string;
  image_url?: string;
  source_meal_id?: number;
}

export function inferDefaultMealType(date = new Date()): MealType {
  const hour = date.getHours();

  if (hour >= 5 && hour <= 10) {
    return "breakfast";
  }

  if (hour >= 11 && hour <= 14) {
    return "lunch";
  }

  if (hour >= 15 && hour <= 17) {
    return "snack";
  }

  if (hour >= 18 && hour <= 22) {
    return "dinner";
  }

  return "unspecified";
}

export function formatMealType(mealType: MealType) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export function omitUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== "")
  ) as Partial<T>;
}

export function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be 8MB or smaller.");
  }
}

export function toOptionalIsoString(datetimeLocalValue?: string) {
  if (!datetimeLocalValue) {
    return undefined;
  }

  return new Date(datetimeLocalValue).toISOString();
}

export function extractPublicUrl(uploadResponse: unknown): string {
  const response = uploadResponse as
    | { public_url?: string; data?: { public_url?: string } }
    | undefined;

  const publicUrl = response?.public_url ?? response?.data?.public_url;

  if (!publicUrl) {
    throw new Error("Upload succeeded but no public URL was returned.");
  }

  return publicUrl;
}

export function buildUploadFileName(input: {
  dish_name?: string;
  meal_type: MealType;
  recorded_at?: string;
}) {
  const recordedAt = input.recorded_at ? new Date(input.recorded_at) : new Date();
  const recordedAtToken = [
    recordedAt.getFullYear(),
    String(recordedAt.getMonth() + 1).padStart(2, "0"),
    String(recordedAt.getDate()).padStart(2, "0"),
    String(recordedAt.getHours()).padStart(2, "0"),
    String(recordedAt.getMinutes()).padStart(2, "0"),
  ].join("-");

  const dishToken = sanitizeFileNameToken(input.dish_name || "meal");
  const mealTypeToken = sanitizeFileNameToken(input.meal_type);

  return [dishToken, mealTypeToken, recordedAtToken].filter(Boolean).join("-");
}

function sanitizeFileNameToken(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return normalized || "meal";
}

export function buildCreateMealPayload(input: CreateMealRequestPayload): CreateMealRequestPayload {
  return omitUndefined({
    dish_name: input.source_meal_id ? undefined : input.dish_name?.trim(),
    meal_type: input.meal_type,
    recorded_at: input.recorded_at,
    image_url: input.source_meal_id ? undefined : input.image_url,
    source_meal_id: input.source_meal_id,
  }) as CreateMealRequestPayload;
}
