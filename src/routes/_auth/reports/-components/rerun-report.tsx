import { Button } from "@/components/ui/button";
import { Sparkles, Loader } from "lucide-react";
import type { ReportMode } from "./report-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RerunReportProps {
  mode: ReportMode;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function RerunReport({ mode, onGenerate, isGenerating }: RerunReportProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Re-run {mode} report
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            Due to forgetting add meals or ai fallback
          </h3>
        </div>
        <div>
          <Button type="button" onClick={() => setOpen(true)} disabled={isGenerating}>
            {!isGenerating && <Sparkles className="size-4" />}
            {isGenerating && <Loader className="size-4 animate-spin" />} Generate Report
          </Button>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will trigger AI to run daily report which costs resources
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onGenerate}>Run</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
