"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Nav = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="flex items-center justify-end gap-2">
      <Button
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        size={"icon"}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
      <Link href={"/report"}>
        <Button>
          Report
        </Button>
      </Link>
    </nav>
  );
};
