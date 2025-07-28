import veganENumbers from "@/lib/e-numbers";
import EnumberForm from "@/components/enumber-form";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="space-y-4">
      <article className="space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Vegan E-number Checker
        </h1>
        <p className="text-center text-muted-foreground">
          Instantly verify if food additives are vegan-friendly using our OCR
          scanner
        </p>
      </article>
      <Suspense fallback={<div>Loading...</div>}>
        <EnumberForm veganENumbers={veganENumbers} />
      </Suspense>

      <aside className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Type or paste ingredient list in the text area</li>
          <li>Or upload a photo of the ingredient label</li>
          <li>Get instant results showing if all E-numbers are vegan</li>
        </ol>
      </aside>
    </div>
  );
}
