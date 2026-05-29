import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import { useUpdateMealAnalysisMutation } from "../-hooks/useUpdateMealAnalysisMutation";
import type { TodayMeal } from "../-queries/today.query";

interface EditAnalysisFormValues {
  estimated_sugar_grams: number;
  estimated_carbs_grams: number;
  estimated_protein_grams: number;
  estimated_calories: number;
}

function getAnalysisFormValues(meal: TodayMeal | null): EditAnalysisFormValues {
  return {
    estimated_sugar_grams: meal?.analysis?.estimated_sugar_grams ?? 0,
    estimated_carbs_grams: meal?.analysis?.estimated_carbs_grams ?? 0,
    estimated_protein_grams: meal?.analysis?.estimated_protein_grams ?? 0,
    estimated_calories: meal?.analysis?.estimated_calories ?? 0,
  };
}

export function EditAnalysisForm({
  dateKey,
  meal,
  onSuccess,
}: {
  dateKey: string;
  meal: TodayMeal | null;
  onSuccess: () => void;
}) {
  const form = useForm<EditAnalysisFormValues>({
    defaultValues: getAnalysisFormValues(meal),
  });

  const updateMealAnalysisMutation = useUpdateMealAnalysisMutation(onSuccess);

  useEffect(() => {
    if (!meal) {
      return;
    }

    form.reset(getAnalysisFormValues(meal));
  }, [form, meal]);

  const handleSubmit = async (values: EditAnalysisFormValues) => {
    if (!meal) {
      return;
    }

    form.clearErrors();

    try {
      await updateMealAnalysisMutation.mutateAsync({
        mealId: meal.id,
        dateKey,
        estimated_sugar_grams: Number(values.estimated_sugar_grams),
        estimated_carbs_grams: Number(values.estimated_carbs_grams),
        estimated_protein_grams: Number(values.estimated_protein_grams),
        estimated_calories: Number(values.estimated_calories),
      });
      toast.success("Analysis updated successfully.");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Unable to update analysis right now.");
      toast.error(errorMessage);
      form.setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <Form {...form}>
      <form className="flex min-h-full flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid min-h-[320px] flex-1 gap-4 sm:grid-cols-2">
          <NumberField control={form.control} label="Sugar" name="estimated_sugar_grams" unit="g" />
          <NumberField control={form.control} label="Carbs" name="estimated_carbs_grams" unit="g" />
          <NumberField control={form.control} label="Protein" name="estimated_protein_grams" unit="g" />
          <NumberField control={form.control} label="Calories" name="estimated_calories" unit="kcal" />
        </div>

        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <div className="sticky bottom-0 -mx-4 border-t border-border bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0">
          <Button className="w-full md:w-auto" disabled={updateMealAnalysisMutation.isPending} type="submit">
            {updateMealAnalysisMutation.isPending ? "Saving analysis..." : "Save analysis"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function NumberField({
  control,
  name,
  label,
  unit,
}: {
  control: ReturnType<typeof useForm<EditAnalysisFormValues>>["control"];
  name: keyof EditAnalysisFormValues;
  label: string;
  unit: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                min={0}
                onChange={(event) => field.onChange(event.target.valueAsNumber || 0)}
                step="0.1"
                type="number"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                {unit}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
