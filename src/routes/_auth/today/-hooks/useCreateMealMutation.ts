import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeal } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";
import { type CreateMealRequestPayload } from "./add-meal.helpers";
import { reportKeys } from "../../reports/-queries/report.query";

export interface CreateMealPayload extends CreateMealRequestPayload {
  dateKey: string;
}

export function useCreateMealMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dateKey: _dateKey, ...payload }: CreateMealPayload) => createMeal(payload),
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
