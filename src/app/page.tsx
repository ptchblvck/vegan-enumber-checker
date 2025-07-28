import veganENumbers from "@/lib/e-numbers";
import EnumberForm from "./_components/enumber-form";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Vegan E-number Checker</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EnumberForm veganENumbers={veganENumbers} />
      </Suspense>
    </div>
  );
}
