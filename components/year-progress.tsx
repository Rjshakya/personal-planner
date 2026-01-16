"use client";

import * as React from "react";
import { startOfYear, endOfYear, differenceInMilliseconds } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function YearProgress({ className }: { className?: string }) {
  const [percentage, setPercentage] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const now = new Date();
    const start = startOfYear(now);
    const end = endOfYear(now);

    // Calculate percentage based on milliseconds for accuracy
    const totalDuration = differenceInMilliseconds(end, start);
    const passedDuration = differenceInMilliseconds(now, start);

    const percent = Math.round((passedDuration / totalDuration) * 100);
    setPercentage(Math.min(100, Math.max(0, percent)));
  }, []);

  // Create an array of 100 items (10x10 grid)
  const dots = Array.from({ length: 100 }, (_, i) => i);

  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Year</CardTitle>
        <span className="text-sm font-bold text-muted-foreground">
          {mounted ? `${percentage}%` : "0%"}
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-3">
          {dots.map((i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-full transition-colors duration-500",
                mounted && i < percentage ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
