import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMealAnalysis } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";

export interface UpdateMealAnalysisPayload {
  mealId: number;
  dateKey: string;
  estimated_sugar_grams: number;
  estimated_carbs_grams: number;
  estimated_protein_grams: number;
  estimated_calories: number;
}

export function useUpdateMealAnalysisMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mealId, dateKey: _dateKey, ...payload }: UpdateMealAnalysisPayload) =>
      updateMealAnalysis(mealId, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todayKeys.all }),
        queryClient.invalidateQueries({ queryKey: todayKeys.list(variables.dateKey) }),
        queryClient.invalidateQueries({ queryKey: recentMealsKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["reports", "daily", variables.dateKey] }),
      ]);

      onSuccess?.();
    },
  });
}
