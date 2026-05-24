import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeal } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";
import { type CreateMealRequestPayload } from "./add-meal.helpers";

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
        queryClient.invalidateQueries({ queryKey: ["reports", "daily", variables.dateKey] }),
      ]);

      onSuccess?.();
    },
  });
}
