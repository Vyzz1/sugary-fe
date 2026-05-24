import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  BASE_RUN_DAILY_REPORT_URL,
  reportKeys,
  type DailyReportResponse,
} from "../-queries/report.query";

export function useRunDailyReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      const response = await api.post<DailyReportResponse>(BASE_RUN_DAILY_REPORT_URL, { date });
      return response.data;
    },
    onSuccess: async (_data, date) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reportKeys.all }),
        queryClient.invalidateQueries({ queryKey: reportKeys.daily(date) }),
      ]);
    },
  });
}
