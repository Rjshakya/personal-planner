"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Nav = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav className=" fixed top-1 right-1 p-2 flex items-center justify-end gap-2 z-50 backdrop-blur-2xl">
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
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#fef1f1"
            viewBox="0 0 256 256"
          >
            <path d="M236,208a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V48a12,12,0,0,1,24,0v99l43.51-43.52a12,12,0,0,1,17,0L128,127l43-43H160a12,12,0,0,1,0-24h40a12,12,0,0,1,12,12v40a12,12,0,0,1-24,0V101l-51.51,51.52a12,12,0,0,1-17,0L96,129,44,181v15H224A12,12,0,0,1,236,208Z"></path>
          </svg> */}
        </Button>
      </Link>
    </nav>
  );
};
