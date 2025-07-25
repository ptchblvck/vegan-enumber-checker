"use client";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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

const MAX_IMAGE_SIZE = 1600; // Maximum dimension for processed images

async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height && width > MAX_IMAGE_SIZE) {
        height = (height * MAX_IMAGE_SIZE) / width;
        width = MAX_IMAGE_SIZE;
      } else if (height > MAX_IMAGE_SIZE) {
        width = (width * MAX_IMAGE_SIZE) / height;
        height = MAX_IMAGE_SIZE;
      }

      canvas.width = width;
      canvas.height = height;

      // Apply image processing for better OCR
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Increase contrast
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const threshold = 128;
        const value = avg > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert canvas to blob"));
          }
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    // Convert File to base64 and load it
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
      veganENumbers.includes(eNumber)
    );

    if (allVegan) {
      router.push("/yes");
    } else {
      router.push("/no");
    }
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
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            onChange={(e) => e.target.files && handleImage(e.target.files[0])}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="text-sm text-gray-500">Processing image...</div>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button type="submit" className="w-full">
          Check
        </Button>

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
                          veganENumbers.includes(number)
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
      </form>
    </Form>
  );
};

export default EnumberForm;
