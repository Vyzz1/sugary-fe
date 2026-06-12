import { useApiQuery } from "@/hooks/useApiQuery";
import { isDailyReportNotFound } from "./report.helpers";
import {
  BASE_DAILY_REPORT_URL,
  reportKeys,
  reportQueryOptions,
  type DailyReportResponse,
} from "../-queries/report.query";

function toDailyReportApiParams(date: string) {
  return { date };
}

export function useDailyReportQuery(date: string, enabled = true) {
  return useApiQuery<DailyReportResponse>(reportKeys.daily(date), BASE_DAILY_REPORT_URL, {
    ...reportQueryOptions,
    enabled,
    retry: (failureCount, error) => {
      if (isDailyReportNotFound(error)) {
        return false;
      }

      return failureCount < 2;
    },
    axiosConfig: {
      params: toDailyReportApiParams(date),
    },
  });
}
