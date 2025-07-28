import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | How Our Vegan E-Number Checker Works",
  description:
    "Learn how our vegan E-number checker helps you identify non-vegan food additives using OCR technology and comprehensive databases.",
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        About Vegan E-Number Checker
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our Vegan E-Number Checker helps you quickly determine if food
          products contain vegan-friendly ingredients by analyzing E-numbers
          (food additives) found in ingredient lists.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">OCR Technology</h3>
            <p className="text-muted-foreground">
              Upload photos of ingredient labels and Tesseract.js OCR technology
              extracts text automatically.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">E-Numbers</h3>
            <p className="text-muted-foreground">
              We maintain 400+ verified vegan E-numbers sourced from food safety
              authorities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
