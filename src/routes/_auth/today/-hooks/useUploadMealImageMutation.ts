import { useMutation } from "@tanstack/react-query";
import { uploadMealImage } from "./add-meal.api";
import type { MealType } from "./add-meal.helpers";

export function useUploadMealImageMutation() {
  return useMutation({
    mutationFn: async (input: {
      file: File;
      dish_name?: string;
      meal_type: MealType;
      recorded_at?: string;
    }) => uploadMealImage(input),
  });
}
