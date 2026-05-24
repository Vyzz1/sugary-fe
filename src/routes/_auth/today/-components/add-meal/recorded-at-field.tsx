import { Label } from "@/components/ui/label";

export function RecordedAtField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <Label>Recorded time</Label>
      <input
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        onChange={(event) => onChange(event.target.value)}
        type="datetime-local"
        value={value}
      />
      <p className="text-sm text-muted-foreground">Leave blank to let the backend use now.</p>
    </label>
  );
}
