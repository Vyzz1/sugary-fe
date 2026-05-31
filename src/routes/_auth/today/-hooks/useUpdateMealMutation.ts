import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeal } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";
import { type UpdateMealRequestPayload } from "./add-meal.helpers";
import { reportKeys } from "../../reports/-queries/report.query";

export interface UpdateMealPayload extends UpdateMealRequestPayload {
  mealId: number;
  dateKey: string;
}

export function useUpdateMealMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mealId, dateKey: _dateKey, ...payload }: UpdateMealPayload) =>
      updateMeal(mealId, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todayKeys.all }),
        queryClient.invalidateQueries({ queryKey: todayKeys.list(variables.dateKey) }),
        queryClient.invalidateQueries({ queryKey: recentMealsKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["meals-history"] }),
        queryClient.invalidateQueries({ queryKey: reportKeys.all }),
      ]);

      onSuccess?.();
    },
  });
}
