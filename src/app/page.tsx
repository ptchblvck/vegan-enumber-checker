import veganENumbers from "@/lib/e-numbers";
import EnumberForm from "./_components/enumber-form";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vegan E-number Checker</h1>
      <EnumberForm veganENumbers={veganENumbers} />
    </div>
  );
}
