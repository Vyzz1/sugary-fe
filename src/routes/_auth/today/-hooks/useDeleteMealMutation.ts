import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeal } from "./add-meal.api";
import { recentMealsKeys, todayKeys } from "../-queries/today.query";

export function useDeleteMealMutation(dateKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: number) => deleteMeal(mealId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todayKeys.all }),
        queryClient.invalidateQueries({ queryKey: todayKeys.list(dateKey) }),
        queryClient.invalidateQueries({ queryKey: recentMealsKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["reports", "daily", dateKey] }),
      ]);
    },
  });
}
