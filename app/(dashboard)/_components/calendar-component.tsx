"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export const CalendarComponent = ({ className }: { className?: string }) => {
 

  return (
    <div
      className={cn(
        `bg-amber-300 dark:bg-amber-900 shadow-sm p-1 flex flex-col gap-2`,
        className
      )}
    >
      <div className=" text-xs  py-1 px-0.5 flex items-center justify-between text-muted-foreground font-bold ">
        {/* {format(today, "PPP")} */}
      </div>
      <Card className=" ring-0 ">
        <CardHeader className="mb-4">
          <CardTitle className="font-bold text-xl">Calendar</CardTitle>
        </CardHeader>
        <CardContent className=" grid gap-6">
          <Calendar mode="single" className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
