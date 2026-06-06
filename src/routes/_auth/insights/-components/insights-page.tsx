import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error";
import { InsightsContent } from "./insights-content";
import { InsightsEmptyState, InsightsLoadingState } from "./insights-states";
import { InsightsHeader } from "./insights-header";
import { useInsightQuery } from "../-hooks/useInsightQuery";
import type { InsightRange } from "../-queries/insights.query";

export function InsightsPage() {
  const [range, setRange] = useState<InsightRange>("7d");
  const insightQuery = useInsightQuery(range);
  const insight = insightQuery.data?.data;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 pb-24 sm:px-5 lg:px-6">
      <InsightsHeader onRangeChange={setRange} range={range} />

      {insightQuery.isLoading ? <InsightsLoadingState /> : null}

      {insightQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to load insights</AlertTitle>
          <AlertDescription>
            {getErrorMessage(insightQuery.error, "Unable to load insights right now.")}
            <div className="mt-3">
              <Button onClick={() => void insightQuery.refetch()} size="sm" type="button">
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {insight && insight.summary.total_meals === 0 ? <InsightsEmptyState /> : null}

      {insight && insight.summary.total_meals > 0 ? <InsightsContent insight={insight} /> : null}
    </div>
  );
}
