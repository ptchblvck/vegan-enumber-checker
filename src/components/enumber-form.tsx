"use client";
import { FC, useMemo, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import processImage from "@/lib/process-image";
import VeganResult from "./vegan-result";
import { FormSubmissionIsVegan } from "@/lib/form-submission-is-vegan";
import { Textarea } from "./ui/textarea";
import Broom from "./icons/broom";

interface EnumberFormProps {
  className?: string;
  veganENumbers: string[];
}

const EnumberFormSchema = z.object({
  text: z.string().min(1, "Please enter some text to check for E-numbers"),
  image: z.instanceof(File).optional(),
  results: z.array(z.string()),
});

type FormData = z.infer<typeof EnumberFormSchema>;

const EnumberForm: FC<EnumberFormProps> = ({ className, veganENumbers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [veganStatus, setVeganStatus] = useState<FormSubmissionIsVegan>(
    FormSubmissionIsVegan.NotSubmitted
  );
  const [error, setError] = useState<string | null>(null);
  const veganSet = useMemo(
    () => new Set(veganENumbers.map((e) => e.toUpperCase())),
    [veganENumbers]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(EnumberFormSchema),
    defaultValues: {
      text: "",
      image: undefined,
      results: [],
    },
    mode: "onTouched", // Validate after field is touched (better UX than onChange)
    reValidateMode: "onChange", // Re-validate immediately on change after first validation
  });

  // Watch the text field for real-time processing
  const watchedText = useWatch({
    control: form.control,
    name: "text",
  });

  const processText = useCallback(
    (raw: string) => {
      const regex = /\b[Ee][- ]?\d{3,4}[a-z]?\b/gi;
      const matches = raw.match(regex) || [];
      const unique = Array.from(new Set(matches.map((m) => m.toUpperCase())));
      form.setValue("results", unique);
    },
    [form]
  );

  // Process text whenever it changes
  useEffect(() => {
    if (watchedText) {
      processText(watchedText);
    } else {
      // Clear results when text is empty
      form.setValue("results", []);
    }
  }, [watchedText, form, processText]);

  async function handleImage(file: File) {
    setIsLoading(true);
    setError(null);
    try {
      const processedBlob = await processImage(file);
      const worker = await createWorker();

      const {
        data: { text: raw },
      } = await worker.recognize(
        processedBlob,
        { rotateAuto: true },
        { imageColor: true, imageGrey: true, imageBinary: true }
      );

      await worker.terminate();

      // Clear any existing validation errors for the text field
      form.clearErrors("text");

      // Set the text value and trigger validation and mark as touched
      form.setValue("text", raw, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Force re-validation to ensure form state is updated
      await form.trigger("text");

      // processText will be called automatically via useEffect watching the text field
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("OCR error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // Clear all form fields and validation errors
    form.setValue("text", "", { shouldValidate: true });
    form.setValue("results", []);
    form.clearErrors();
    form.resetField("image");

    // Clear component state
    setError(null);
    setVeganStatus(FormSubmissionIsVegan.NotSubmitted);
  }

  function onSubmit(values: FormData) {
    // Clear any previous errors
    setError(null);

    // The results are already updated via useEffect, so we can use them directly
    const allENumbers = values.results;

    if (allENumbers.length === 0) {
      setError(
        "No E-numbers found in the text. Please ensure your text contains E-numbers (e.g., E100, E200)."
      );
      return;
    }

    // Check if ALL E-numbers are vegan
    const allVegan = allENumbers.every((eNumber) =>
      veganSet.has(eNumber.toUpperCase())
    );

    setVeganStatus(
      allVegan ? FormSubmissionIsVegan.Yes : FormSubmissionIsVegan.No
    );
  }

  if (veganStatus !== FormSubmissionIsVegan.NotSubmitted) {
    return (
      <VeganResult
        isVegan={veganStatus === FormSubmissionIsVegan.Yes}
        handleOnClick={() => {
          return setVeganStatus(FormSubmissionIsVegan.NotSubmitted);
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type or paste ingredients (e.g., 'Contains E100, E200, Salt, Water')"
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between gap-2">
                <FormDescription>
                  Enter the ingredients text or upload an image to scan for
                  E-numbers
                </FormDescription>
                <Button
                  variant="outline"
                  type="button"
                  className="bottom-0 right-0 min-h-11 min-w-11 p-1"
                  onClick={handleClear}
                  disabled={isLoading}
                  aria-label="Clear ingredients text"
                >
                  <span className="sr-only">Clear ingredients text</span>
                  <Broom />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File input for image upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="hidden" htmlFor="image">
                Upload Ingredients Image
              </FormLabel>
              <FormControl>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:border-primary"
                  onChange={(e) => {
                    // If a file is selected, update the field and process the image
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files[0]);
                      handleImage(e.target.files[0]);
                    }
                  }}
                  disabled={isLoading}
                  aria-label="Upload ingredients image"
                />
              </FormControl>
              {isLoading && (
                <FormDescription>Processing image...</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <FormField
          control={form.control}
          name="results"
          render={({ field }) => (
            <FormItem>
              {field.value.length > 0 && (
                <div className="space-y-2">
                  <FormLabel>Found E-numbers:</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((number) => (
                      <span
                        key={number}
                        className={`px-2 py-1 text-sm rounded ${
                          veganSet.has(number.toUpperCase())
                            ? "bg-green-100 text-green-800 border border-green-800 dark:border-transparent"
                            : "bg-red-100 text-red-800 border border-red-800 dark:border-transparent"
                        }`}
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                  <FormDescription>
                    {field.value.length !== 0 &&
                      `${field.value.length} E-numbers found`}
                  </FormDescription>
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || form.watch("results").length === 0}
        >
          <span className="sr-only">Check E-numbers</span>
          {isLoading ? "Processing..." : "Check"}
        </Button>
      </form>
    </Form>
  );
};

export default EnumberForm;
