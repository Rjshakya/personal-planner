"use client";
import { useTodoStore } from "@/stores/todoStore";
import { CalendarComponent } from "./calendar-component";
import { PomodoroComponent } from "./pomodoro-component";
import { TodoComponent } from "./todo-component";
import { YearCalendar } from "./year-calendar";
import { YearProgress } from "@/components/year-progress";
import { DayProgress } from "@/components/day-progress";

export const Dashboard = () => {
  const hasHydrated = useTodoStore((s) => s._hasHydrated);
  if (!hasHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="w-full max-w-lg mx-auto   grid  gap-8 mt-8"
      style={{ scrollbarWidth: "none" }}
    >
      <h2 className="my-4 text-xs text-muted-foreground">[ Personal planner ]</h2>

      <div className="grid  sm:grid-cols-2 gap-4 col-span-1">
        <YearProgress />
        <DayProgress />
      </div>
      <TodoComponent className="col-span-1 mt-14" />
      {/* <PomodoroComponent className="col-span-1" /> */}
    </div>
  );
};
