"use client";

import { useMemo } from "react";
import {
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  format,
  differenceInDays,
  isSameDay,
  startOfDay,
  isLeapYear,
} from "date-fns";
import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface YearCalendarProps {
  className?: string;
}

export function YearCalendar({ className }: YearCalendarProps) {
  const { gridData, percentage, totalDays, passedDays, currentYear } = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const today = startOfDay(now);
    const year = now.getFullYear();

    // Get all weeks in the year (starting on Sunday)
    const weeks = eachWeekOfInterval(
      { start: yearStart, end: yearEnd },
      { weekStartsOn: 0 }
    );

    // Calculate total days in year (accounting for leap years)
    const totalDaysInYear = isLeapYear(now) ? 366 : 365;

    // Calculate passed days
    const passed = differenceInDays(today, yearStart) + 1;
    const percentage = Math.round((passed / totalDaysInYear) * 100);

    // Create 7x52 grid (7 days × 52 weeks)
    const grid: (Date | null)[][] = Array.from({ length: 7 }, () => Array(52).fill(null));

    weeks.forEach((weekStart, weekIndex) => {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + dayOfWeek);

        // Only include days within the current year
        if (dayDate.getFullYear() === year && weekIndex < 52) {
          grid[dayOfWeek][weekIndex] = dayDate;
        }
      }
    });

    return {
      gridData: grid,
      percentage,
      totalDays: totalDaysInYear,
      passedDays: passed,
      currentYear: year,
    };
  }, []);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{currentYear} Progress</CardTitle>
          <span className="text-sm text-muted-foreground font-normal">
            {percentage}% passed
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col justify-between h-[168px] pr-1">
            {dayLabels.map((label, index) => (
              <span
                key={label}
                className="text-[10px] text-muted-foreground leading-none h-3 flex items-center"
                style={{ marginTop: index === 0 ? '2px' : '0' }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex-1">
            <div className="grid grid-cols-52 gap-1">
              {gridData.flat().map((dayDate, index) => {
                if (!dayDate) {
                  return (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-sm bg-transparent"
                    />
                  );
                }

                const isPassed = dayDate <= startOfDay(new Date());
                const isToday = isSameDay(dayDate, startOfDay(new Date()));

                return (
                  <div
                    key={index}
                    className={clsx(
                      "w-3 h-3 rounded-sm transition-all duration-200 hover:scale-110",
                      isPassed
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted/30 border border-muted/50 hover:bg-muted/50",
                      isToday && "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                    )}
                    title={`${format(dayDate, "EEEE, MMMM d, yyyy")}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-xs text-muted-foreground px-5">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{passedDays} of {totalDays} days passed</span>
          <span>{totalDays - passedDays} days remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
