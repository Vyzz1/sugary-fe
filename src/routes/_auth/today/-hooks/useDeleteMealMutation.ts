import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeal } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";
import { reportKeys } from "../../reports/-queries/report.query";

export interface DeleteMealPayload {
  mealId: number;
  dateKey: string;
}

export function useDeleteMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mealId }: DeleteMealPayload) => deleteMeal(mealId),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todayKeys.all }),
        queryClient.invalidateQueries({ queryKey: todayKeys.list(variables.dateKey) }),
        queryClient.invalidateQueries({ queryKey: recentMealsKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["meals-history"] }),
        queryClient.invalidateQueries({ queryKey: reportKeys.all }),
      ]);
    },
  });
}
