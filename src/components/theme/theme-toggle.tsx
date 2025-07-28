"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure the component is mounted before accessing the theme
    setMounted(true);
  }, []);

  function handleThemeChange(checked: boolean) {
    // Update the theme directly
    setTheme(checked ? "dark" : "light");
  }

  return mounted ? (
    <label
      htmlFor="themeToggle"
      className={cn(
        "relative w-12 md:w-8 text-muted-foreground cursor-pointer",
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>{" "}
      {/* For extra accessibility */}
      <input
        type="checkbox"
        name="themeToggle"
        id="themeToggle"
        checked={resolvedTheme === "dark"}
        onChange={(e) => handleThemeChange(e.target.checked)}
        className="opacity-0 w-full aspect-square"
        aria-label="Toggle theme"
      />
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center ",
          resolvedTheme === "dark" ? "text-yellow-500" : "text-blue-800"
        )}
      >
        {resolvedTheme === "dark" ? <MdSunny /> : <FaMoon />}
      </span>
    </label>
  ) : (
    // Fallback during hydration to prevent layout shift
    <div
      className={cn("relative w-12 md:w-8 text-muted-foreground", className)}
    >
      <div className="opacity-0 w-full aspect-square" />
      <span className="absolute inset-0 flex items-center justify-center text-blue-800">
        <FaMoon />
      </span>
    </div>
  );
}
