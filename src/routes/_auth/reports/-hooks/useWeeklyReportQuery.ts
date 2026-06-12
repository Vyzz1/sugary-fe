import { useApiQuery } from "@/hooks/useApiQuery";
import { isWeeklyReportNotFound } from "./report.helpers";
import {
  BASE_WEEKLY_REPORT_URL,
  reportKeys,
  reportQueryOptions,
  type WeeklyReportResponse,
} from "../-queries/report.query";

function toWeeklyReportApiParams(weekStart: string) {
  return { week_start: weekStart };
}

export function useWeeklyReportQuery(weekStart: string, enabled: boolean) {
  return useApiQuery<WeeklyReportResponse>(
    reportKeys.weekly(weekStart),
    BASE_WEEKLY_REPORT_URL,
    {
      ...reportQueryOptions,
      enabled,
      retry: (failureCount, error) => {
        if (isWeeklyReportNotFound(error)) {
          return false;
        }

        return failureCount < 2;
      },
      axiosConfig: {
        params: toWeeklyReportApiParams(weekStart),
      },
    }
  );
}
