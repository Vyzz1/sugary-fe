import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import {
  buildCreateMealPayload,
  buildUpdateMealPayload,
  compressMealImage,
  inferDefaultMealType,
  MAX_MEAL_IMAGE_SIZE_MB,
  toDateTimeLocalValue,
  toOptionalIsoString,
  validateImageFile,
  type MealType,
} from "../../-hooks/add-meal.helpers";
import { useCreateMealMutation } from "../../-hooks/useCreateMealMutation";
import { useUpdateMealMutation } from "../../-hooks/useUpdateMealMutation";
import { useUploadMealImageMutation } from "../../-hooks/useUploadMealImageMutation";
import { ImagePicker, type ImagePickerIntent } from "./image-picker";
import { MealTypeSelect } from "./meal-type-select";
import { RecentMealPicker } from "./recent-meal-picker";
import { RecordedAtField } from "./recorded-at-field";
import type { TodayMeal } from "../../-queries/today.query";

type AddMealTab = "new" | "recent";

interface AddMealFormValues {
  dish_name: string;
  meal_type: MealType;
  recorded_at: string;
}

export function AddMealForm({
  dateKey,
  defaultIntent,
  defaultTab,
  mode = "create",
  initialMeal,
  onSuccess,
}: {
  dateKey: string;
  defaultIntent: ImagePickerIntent;
  defaultTab: AddMealTab;
  mode?: "create" | "edit";
  initialMeal?: TodayMeal | null;
  onSuccess: () => void;
}) {
  const [tab, setTab] = React.useState<AddMealTab>(defaultTab);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = React.useState<string | null>(
    initialMeal?.image_url ?? null
  );
  const [imageIntent, setImageIntent] = React.useState<ImagePickerIntent>(defaultIntent);
  const [imageAutoOpenKey, setImageAutoOpenKey] = React.useState(0);
  const [selectedRecentMeal, setSelectedRecentMeal] = React.useState<TodayMeal | null>(null);
  const [recentError, setRecentError] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [submitStage, setSubmitStage] = React.useState<"idle" | "uploading" | "saving">("idle");
  const didSyncInitialDefaultsRef = React.useRef(false);

  const form = useForm<AddMealFormValues>({
    defaultValues: {
      dish_name: initialMeal?.dish_name ?? "",
      meal_type: initialMeal?.meal_type ?? inferDefaultMealType(),
      recorded_at: toDateTimeLocalValue(initialMeal?.recorded_at),
    },
  });

  const uploadMealImageMutation = useUploadMealImageMutation();
  const createMealMutation = useCreateMealMutation(() => {
    resetState();
    onSuccess();
  });
  const updateMealMutation = useUpdateMealMutation(() => {
    onSuccess();
  });
  const watchedDishName = form.watch("dish_name");

  React.useEffect(() => {
    if (mode === "edit") {
      return;
    }

    if (!didSyncInitialDefaultsRef.current) {
      didSyncInitialDefaultsRef.current = true;
      return;
    }

    setTab(defaultTab);
    setImageIntent(defaultIntent);
    setImageAutoOpenKey((current) => current + 1);
  }, [defaultIntent, defaultTab]);

  React.useEffect(() => {
    if (mode !== "edit" || !initialMeal) {
      return;
    }

    form.reset({
      dish_name: initialMeal.dish_name,
      meal_type: initialMeal.meal_type,
      recorded_at: toDateTimeLocalValue(initialMeal.recorded_at),
    });
    setExistingImageUrl(initialMeal.image_url ?? null);
    setImageFile(null);
    setImagePreviewUrl(initialMeal.image_url ?? null);
    setImageIntent("manual");
    setImageError(null);
    setRecentError(null);
    setSubmitStage("idle");
    setTab("new");
  }, [form, initialMeal, mode]);

  React.useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(existingImageUrl);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [existingImageUrl, imageFile]);

  const resetState = () => {
    form.reset({
      dish_name: "",
      meal_type: inferDefaultMealType(),
      recorded_at: "",
    });
    setImageFile(null);
    setImagePreviewUrl(null);
    setExistingImageUrl(null);
    setSelectedRecentMeal(null);
    setImageError(null);
    setRecentError(null);
    setSubmitStage("idle");
    setImageIntent("manual");
    setTab("new");
  };

  const handleSubmit = async (values: AddMealFormValues) => {
    form.clearErrors();
    setRecentError(null);
    setImageError(null);

    try {
      if (tab === "new") {
        if (!values.dish_name.trim()) {
          form.setError("dish_name", { message: "Dish name is required." });
          return;
        }

        let imageUrl: string | undefined;

        if (imageFile) {
          validateImageFile(imageFile);
          setSubmitStage("uploading");
          imageUrl = await uploadMealImageMutation.mutateAsync({
            file: imageFile,
            dish_name: values.dish_name,
            meal_type: values.meal_type,
            recorded_at: toOptionalIsoString(values.recorded_at),
          });
        }

        setSubmitStage("saving");
        if (mode === "edit" && initialMeal) {
          await updateMealMutation.mutateAsync({
            ...buildUpdateMealPayload({
              dish_name: values.dish_name,
              meal_type: values.meal_type,
              recorded_at: toOptionalIsoString(values.recorded_at),
              image_url: imageFile ? imageUrl : existingImageUrl,
            }),
            mealId: initialMeal.id,
            dateKey,
          });
          toast.success("Meal updated successfully.");
        } else {
          await createMealMutation.mutateAsync({
            ...buildCreateMealPayload({
              dish_name: values.dish_name,
              meal_type: values.meal_type,
              recorded_at: toOptionalIsoString(values.recorded_at),
              image_url: imageUrl,
            }),
            dateKey,
          });
          toast.success("Meal added successfully.");
        }
        return;
      }

      if (!selectedRecentMeal) {
        setRecentError("Please select a recent meal.");
        return;
      }

      setSubmitStage("saving");
      await createMealMutation.mutateAsync({
        ...buildCreateMealPayload({
          meal_type: values.meal_type,
          recorded_at: toOptionalIsoString(values.recorded_at),
          source_meal_id: selectedRecentMeal.id,
        }),
        dateKey,
      });
      toast.success("Meal added successfully.");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Unable to save meal right now.");
      toast.error(errorMessage);
      form.setError("root", {
        message: errorMessage,
      });
      setSubmitStage("idle");
    }
  };

  const submitLabel =
    submitStage === "uploading"
      ? "Uploading image..."
      : submitStage === "saving"
        ? "Saving meal..."
        : mode === "edit"
          ? "Save changes"
        : tab === "recent"
          ? "Add from recent"
          : "Save meal";
  const hasAnalysisRerunChange =
    mode === "edit" &&
    initialMeal &&
    (watchedDishName.trim() !== initialMeal.dish_name ||
      imageFile !== null ||
      existingImageUrl !== (initialMeal.image_url ?? null));

  return (
    <Form {...form}>
      <form className="flex min-h-full flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
        {mode === "edit" ? null : (
          <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                tab === "new" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setTab("new")}
              type="button"
            >
              New meal
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                tab === "recent" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
              onClick={() => setTab("recent")}
              type="button"
            >
              Recent
            </button>
          </div>
        )}

        <div className="flex min-h-[420px] flex-1 flex-col space-y-5 md:min-h-[360px]">
          {tab === "new" ? (
            <div className="grid flex-1 gap-5 md:grid-cols-[1fr_1fr]">
              <div>
                <ImagePicker
                  autoOpenKey={imageAutoOpenKey}
                  errorMessage={imageError ?? undefined}
                  imageFile={imageFile}
                  imagePreviewUrl={imagePreviewUrl}
                  onFileChange={async (file) => {
                    try {
                      setImageError(null);
                      if (!file) {
                        setImageFile(null);
                        return;
                      }

                      const compressedFile = await compressMealImage(file);
                      validateImageFile(compressedFile);
                      setImageFile(compressedFile);
                    } catch (error) {
                      setImageError(
                        getErrorMessage(
                          error,
                          `Please choose a valid image under ${MAX_MEAL_IMAGE_SIZE_MB}MB.`
                        )
                      );
                      setImageFile(null);
                    } finally {
                      setImageIntent("manual");
                    }
                  }}
                  onRemove={() => {
                    setImageFile(null);
                    setExistingImageUrl(null);
                    setImagePreviewUrl(null);
                    setImageError(null);
                  }}
                  preferredIntent={imageIntent}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dish_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dish name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tra dao cam sa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasAnalysisRerunChange ? (
                  <p className="rounded-xl border border-primary/15 bg-primary/6 px-3 py-2 text-sm font-medium leading-6 text-primary">
                    Updating the dish name or meal image will trigger a fresh AI analysis.
                  </p>
                ) : null}

                <FormField
                  control={form.control}
                  name="meal_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MealTypeSelect onChange={field.onChange} value={field.value} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recorded_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RecordedAtField onChange={field.onChange} value={field.value} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col space-y-4">
              <RecentMealPicker
                onSelectMeal={(meal) => {
                  setSelectedRecentMeal(meal);
                  setRecentError(null);
                }}
                selectedMeal={selectedRecentMeal}
              />

              <FormField
                control={form.control}
                name="meal_type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MealTypeSelect onChange={field.onChange} value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recorded_at"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RecordedAtField onChange={field.onChange} value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {recentError ? <p className="text-sm text-destructive">{recentError}</p> : null}
            </div>
          )}

          {form.formState.errors.root?.message ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
        </div>

        <div className="sticky bottom-0 -mx-4 border-t border-border bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0">
          <Button
            className="w-full md:w-auto"
            disabled={
              createMealMutation.isPending ||
              updateMealMutation.isPending ||
              uploadMealImageMutation.isPending
            }
            type="submit"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
