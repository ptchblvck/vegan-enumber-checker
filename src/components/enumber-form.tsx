"use client";
import { FC, useMemo, useState, useEffect, useCallback, useRef } from "react";
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
import { IoCameraSharp } from "react-icons/io5";
import { DotWave } from "ldrs/react";
import "ldrs/react/DotWave.css";
import { ENumberArrayItem } from "@/lib/e-numbers/vegan-e-numbers-full";

interface EnumberFormProps {
  className?: string;
  veganENumbers: ENumberArrayItem[];
}

const EnumberFormSchema = z.object({
  text: z.string(),
  processedImageText: z.string().optional(), // Hidden field for processed image data
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [foundENumbers, setFoundENumbers] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const veganSet = useMemo(
    () =>
      new Set(
        veganENumbers
          .filter((item) => item.vegan === true)
          .map((item) => item.code.toUpperCase())
      ),
    [veganENumbers]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(EnumberFormSchema),
    defaultValues: {
      text: "",
      processedImageText: "",
      image: undefined,
      results: [],
    },
    mode: "onTouched", // Validate after field is touched (better UX than onChange)
    reValidateMode: "onChange", // Re-validate immediately on change after first validation
  });

  // Watch both text fields for real-time processing
  const watchedText = useWatch({
    control: form.control,
    name: "text",
  });

  const watchedProcessedImageText = useWatch({
    control: form.control,
    name: "processedImageText",
  });

  // Process manual text input - looks for E-numbers with or without "E" prefix
  const processManualText = useCallback(
    (raw: string) => {
      // Match both "E100" format and plain numbers like "100" that could be E-numbers
      const eNumberRegex = /\b[Ee][- ]?\d{3,4}[a-z]?\b/gi;
      const plainNumberRegex = /\b\d{3,4}[a-z]?\b/g;

      const eNumbers = raw.match(eNumberRegex) || [];
      const plainNumbers = raw.match(plainNumberRegex) || [];

      // Convert plain numbers to E-number format
      const convertedNumbers = plainNumbers.map(
        (num) => `E${num.toUpperCase()}`
      );

      // Combine both types and remove duplicates
      const allMatches = [...eNumbers, ...convertedNumbers];
      const unique = Array.from(
        new Set(allMatches.map((m) => m.toUpperCase()))
      );

      form.setValue("results", unique);
    },
    [form]
  );

  // Process image OCR text - looks for standard E-number format only
  const processImageText = useCallback(
    (raw: string) => {
      const regex = /\b[Ee][- ]?\d{3,4}[a-z]?\b/gi;
      const matches = raw.match(regex) || [];
      const unique = Array.from(new Set(matches.map((m) => m.toUpperCase())));
      form.setValue("results", unique);
    },
    [form]
  );

  // Process manual text input whenever it changes
  useEffect(() => {
    if (watchedText) {
      processManualText(watchedText);
      // Clear any manual validation errors when text is entered
      form.clearErrors("text");
    } else if (!(watchedProcessedImageText ?? "")) {
      // Clear results only if both text fields are empty
      form.setValue("results", []);
    }
  }, [watchedText, watchedProcessedImageText, form, processManualText]);

  // Process image text whenever it changes
  useEffect(() => {
    if (watchedProcessedImageText) {
      processImageText(watchedProcessedImageText);
      // Clear any manual validation errors when image is processed
      form.clearErrors("text");
    } else if (!watchedText) {
      // Clear results only if both text fields are empty
      form.setValue("results", []);
    }
  }, [watchedProcessedImageText, watchedText, form, processImageText]);

  async function handleImage(file: File) {
    setIsLoading(true);
    setError(null);
    setSelectedFileName(file.name);

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

      // Clear any existing validation errors
      form.clearErrors("text");

      // Set the processed image text value (hidden field)
      form.setValue("processedImageText", raw, {
        shouldValidate: false, // Don't validate immediately
        shouldDirty: true,
        shouldTouch: true,
      });

      // Clear the manual text input when processing an image
      form.setValue("text", "");

      // processImageText will be called automatically via useEffect watching the processedImageText field
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("OCR error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function clearFileInputs() {
    if (desktopInputRef.current) {
      desktopInputRef.current.value = "";
    }
    if (mobileInputRef.current) {
      mobileInputRef.current.value = "";
    }
    setSelectedFileName(null);
  }

  function handleClear(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // Clear all form fields and validation errors
    form.setValue("text", "", { shouldValidate: true });
    form.setValue("processedImageText", "", { shouldValidate: true });
    form.setValue("results", []);
    form.setValue("image", undefined, { shouldValidate: true });
    form.clearErrors();

    // Clear file inputs
    clearFileInputs();

    // Clear component state
    setError(null);
    setVeganStatus(FormSubmissionIsVegan.NotSubmitted);
  }

  function onSubmit(values: FormData) {
    // Clear any previous errors
    setError(null);

    // The results are already updated via useEffect, so we can use them directly
    const allENumbers = values.results;

    // Check if we have any results (E-numbers found)
    if (allENumbers.length === 0) {
      // Check if either text or processedImageText has content to give appropriate error message
      const hasManualText = values.text && values.text.length > 0;
      const hasProcessedText =
        values.processedImageText && values.processedImageText.length > 0;

      if (!hasManualText && !hasProcessedText) {
        form.setError("text", {
          type: "manual",
          message:
            "Please enter some text or upload an image to check for E-numbers",
        });
        return;
      } else {
        // Provide context-aware error message
        const hasManualText = values.text && values.text.length > 0;
        const hasProcessedText =
          values.processedImageText && values.processedImageText.length > 0;

        if (hasProcessedText && !hasManualText) {
          setError(
            "No E-numbers found in the uploaded image. Please ensure your image contains visible E-numbers (e.g., E100, E200) or try entering the ingredients manually."
          );
        } else if (hasManualText && !hasProcessedText) {
          setError(
            "No E-numbers found in the text. Please ensure your text contains E-numbers (e.g., E100, E200 or just 100, 200)."
          );
        } else {
          setError(
            "No E-numbers found. Please ensure your input contains E-numbers (e.g., E100, E200)."
          );
        }
        return;
      }
    }

    // Check if ALL E-numbers are vegan
    const allVegan = allENumbers.every((eNumber) =>
      veganSet.has(eNumber.toUpperCase())
    );

    // Create the array of found E-numbers with their names
    const eNumbersWithNames = allENumbers.map((eNumber) => {
      const foundENumber = veganENumbers.find(
        (item) => item.code.toUpperCase() === eNumber.toUpperCase()
      );
      return {
        code: eNumber.toUpperCase(),
        name: foundENumber?.name || "Unknown",
      };
    });

    setFoundENumbers(eNumbersWithNames);
    setVeganStatus(
      allVegan ? FormSubmissionIsVegan.Yes : FormSubmissionIsVegan.No
    );
  }

  if (veganStatus !== FormSubmissionIsVegan.NotSubmitted) {
    return (
      <VeganResult
        isVegan={veganStatus === FormSubmissionIsVegan.Yes}
        eNumbers={foundENumbers}
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
                  placeholder="e.g., Contains 100, E200, carrageenan, salt, water..."
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between gap-2">
                <FormDescription>
                  Type ingredients manually or use the camera/file upload below.
                  Numbers like &quot;100&quot; are automatically recognized as
                  &quot;E100&quot;.
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

        {/* Hidden field for processed image text */}
        <FormField
          control={form.control}
          name="processedImageText"
          render={({ field }) => (
            <input
              type="hidden"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />

        {/* File input for image upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="relative flex items-center gap-4">
              <FormLabel className="hidden" htmlFor="image">
                Upload Ingredients Image
              </FormLabel>
              <FormControl>
                <input
                  ref={desktopInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="block w-full min-h-11 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:border-primary"
                  onChange={(e) => {
                    // If a file is selected, update the field and process the image
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files[0]);
                      handleImage(e.target.files[0]);
                      // Clear the mobile input to avoid confusion
                      if (mobileInputRef.current) {
                        mobileInputRef.current.value = "";
                      }
                    }
                  }}
                  disabled={isLoading}
                  aria-label="Upload ingredients image"
                />
              </FormControl>
              <FormLabel className="sr-only" htmlFor="image-mobile">
                Upload Ingredients Image (Mobile)
              </FormLabel>
              <FormControl>
                <label
                  htmlFor="image-mobile"
                  className="flex md:hidden items-center justify-center min-w-11 min-h-11 px-2 text-primary bg-primary/5 hover:bg-primary/10 border-2 border-primary rounded-full cursor-pointer transition-colors"
                >
                  <IoCameraSharp size={26} />
                  <span className="sr-only">Upload ingredients image</span>
                  <input
                    ref={mobileInputRef}
                    id="image-mobile"
                    name="image-mobile"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        field.onChange(e.target.files[0]);
                        handleImage(e.target.files[0]);
                        // Clear the desktop input to avoid confusion
                        if (desktopInputRef.current) {
                          desktopInputRef.current.value = "";
                        }
                      }
                    }}
                    disabled={isLoading}
                    aria-label="Upload ingredients image"
                  />
                </label>
              </FormControl>
              {isLoading && (
                <div className="absolute w-full h-full bg-muted border border-primary rounded-md flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">
                    Processing image
                  </span>
                  <DotWave color="var(--muted-foreground)" size={30} />
                </div>
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
          disabled={
            isLoading ||
            (form.watch("results").length === 0 &&
              !form.watch("text") &&
              !(form.watch("processedImageText") ?? ""))
          }
        >
          <span className="sr-only">Check E-numbers</span>
          Check
        </Button>
      </form>
    </Form>
  );
};

export default EnumberForm;
