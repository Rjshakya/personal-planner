"use client";

import * as React from "react";
import { startOfDay, endOfDay, differenceInMilliseconds } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DayProgress({ className }: { className?: string }) {
  const [percentage, setPercentage] = React.useState(0);
  const [hoursPassed, setHoursPassed] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const updateProgress = () => {
      const now = new Date();
      const start = startOfDay(now);
      const end = endOfDay(now);

      const totalDuration = differenceInMilliseconds(end, start);
      const passedDuration = differenceInMilliseconds(now, start);

      const percent = Math.round((passedDuration / totalDuration) * 100);
      setPercentage(Math.min(100, Math.max(0, percent)));
      setHoursPassed(now.getHours());
    };

    updateProgress();
    // Update every minute to keep it reasonably fresh without excessive re-renders
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  // Create an array of 24 items (representing 24 hours)
  const dots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Day</CardTitle>
        <span className="text-sm font-bold text-muted-foreground">
          {mounted ? `${percentage}%` : "0%"}
        </span>
      </CardHeader>
      <CardContent>
        {/* 6 columns x 4 rows grid for 24 dots */}
        <div className="grid grid-cols-6 gap-3">
          {dots.map((i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-full transition-colors duration-500",
                mounted && i < hoursPassed ? "bg-primary" : "bg-muted"
              )}
              title={`Hour ${i + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
