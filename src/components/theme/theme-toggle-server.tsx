"use client";
import dynamic from "next/dynamic";
const ThemeToggle = dynamic(() => import("@/components/theme/theme-toggle"), {
  ssr: false,
});

interface ThemeToggleServerProps {
  className?: string;
}

export default function ThemeToggleServer({
  className,
}: ThemeToggleServerProps) {
  return <ThemeToggle className={className} />;
}
