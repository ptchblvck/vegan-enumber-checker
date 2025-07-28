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

interface EnumberFormProps {
  className?: string;
  veganENumbers: string[];
}

const EnumberFormSchema = z.object({
  text: z.string(),
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
      } = await worker.recognize(processedBlob);

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
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Type or paste ingredients"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the ingredients text or upload an image to scan for
                E-numbers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <label htmlFor="image" className="hidden">
            Or upload an image:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            name="image"
            capture="environment"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:border-primary"
            onChange={(e) => e.target.files && handleImage(e.target.files[0])}
            disabled={isLoading}
            aria-label="Upload ingredients image"
          />
          {isLoading && (
            <div className="text-sm text-gray-500">Processing image...</div>
          )}
        </div>

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
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
