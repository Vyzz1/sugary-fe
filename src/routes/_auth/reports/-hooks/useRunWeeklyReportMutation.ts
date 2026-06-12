import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  BASE_RUN_WEEKLY_REPORT_URL,
  reportKeys,
  type WeeklyReportResponse,
} from "../-queries/report.query";

export function useRunWeeklyReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekStart: string) => {
      const response = await api.post<WeeklyReportResponse>(BASE_RUN_WEEKLY_REPORT_URL, null, {
        params: { week_start: weekStart },
      });
      return response.data;
    },
    onSuccess: async (_data, weekStart) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reportKeys.all }),
        queryClient.invalidateQueries({ queryKey: reportKeys.weekly(weekStart) }),
      ]);
    },
  });
}
