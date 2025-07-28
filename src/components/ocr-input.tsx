"use client";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { FC } from "react";
import { cn } from "@/lib/utils";

/* you are currently at ocr-input */
interface OcrInputProps {
  veganENumbers: string[];
  className?: string;
}
const OcrInput: FC<OcrInputProps> = ({ className, veganENumbers }) => {
  const [text, setText] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImage(file: File) {
    setIsLoading(true);
    setError(null);
    try {
      const worker = await createWorker();
      const {
        data: { text: raw },
      } = await worker.recognize(file);
      await worker.terminate();
      setText(raw);
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
    setFound(unique.filter((e) => veganENumbers.includes(e)));
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <textarea
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="Type or paste ingredients"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            processText(e.target.value);
          }}
        />
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:border-chart-2 file:bg-chart-2/5 file:text-chart-2 hover:file:bg-chart-2/10"
            onChange={(e) => e.target.files && handleImage(e.target.files[0])}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="text-sm text-gray-500">Processing image...</div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {found.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Found Vegan E-numbers:</h3>
          <div className="flex flex-wrap gap-2">
            {found.map((number) => (
              <span
                key={number}
                className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded"
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrInput;
