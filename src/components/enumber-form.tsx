"use client";
import { FC, useMemo, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import processImage from "@/lib/process-image";
import VeganResult from "./vegan-result";
import { FormSubmissionIsVegan } from "@/lib/form-submission-is-vegan";
import { Textarea } from "./ui/textarea";
import { GiMagicBroom } from "react-icons/gi";
import Broom from "./icons/broom";

interface EnumberFormProps {
  className?: string;
  veganENumbers: string[];
}

const EnumberFormSchema = z.object({
  text: z.string(),
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
  // No need for canvasRef since we're using dynamic canvas creation

  const form = useForm<FormData>({
    resolver: zodResolver(EnumberFormSchema),
    defaultValues: {
      text: "",
      image: undefined,
      results: [],
    },
  });

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
      form.setValue("text", raw);
      processText(raw);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("OCR error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function processText(raw: string) {
    const regex = /\b[Ee][- ]?\d{3,4}[a-z]?\b/gi;
    const matches = raw.match(regex) || [];
    const unique = Array.from(new Set(matches.map((m) => m.toUpperCase())));
    form.setValue("results", unique);
  }

  function handleClear(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    form.setValue("text", "");
    form.setValue("results", []);
    setError(null);
    setVeganStatus(FormSubmissionIsVegan.NotSubmitted);
    form.resetField("image");
  }

  function onSubmit(values: FormData) {
    processText(values.text);

    const allENumbers = values.results;
    if (allENumbers.length === 0) {
      setError("No E-numbers found in the text.");
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
                <Textarea placeholder="Type or paste ingredients" {...field} />
              </FormControl>
              <div className="flex items-center justify-between">
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
                  {/* <GiMagicBroom /> */}
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
                  capture="environment"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:border-primary"
                  onChange={(e) => {
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
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Check
        </Button>
      </form>
    </Form>
  );
};

export default EnumberForm;
