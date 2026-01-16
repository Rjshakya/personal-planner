"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodoStore } from "@/stores/todoStore";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const WeeklyReportTodos = () => {
  const { todos } = useTodoStore();

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 }); // Saturday
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day) => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const dayTodos = todos.filter((todo) => {
        const createdAt = new Date(todo.createdAt);
        return createdAt >= dayStart && createdAt <= dayEnd;
      });

      const completedTodos = todos.filter((todo) => {
        if (!todo.doneAt) return false;
        const doneAt = new Date(todo.doneAt);
        return doneAt >= dayStart && doneAt <= dayEnd;
      });

      return {
        day: format(day, "EEE"),
        created: dayTodos.length,
        completed: completedTodos.length,
      };
    });
  }, [todos]);

  const chartConfig = {
    created: {
      label: "Created",
      color: "var(--chart-1)",
    },
    completed: {
      label: "Completed",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Weekly Todo Report</CardTitle>
      </CardHeader>
      <CardContent className=" grid mt-8">
        <ChartContainer config={chartConfig} className="">
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" />
            {/* <YAxis /> */}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="created" fill="var(--color-created)" />
            <Bar dataKey="completed" fill="var(--color-completed)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const WeeklyReportFocus = () => {
  const { totalFocus } = useTodoStore();

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 }); // Saturday
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day) => {
      const dayKey = new Date(day).toISOString().split("T")[0];
      const focusSeconds = totalFocus[dayKey] || 0;
      const focusMinutes = Math.floor(focusSeconds / 60);

      return {
        day: format(day, "EEE"),
        focusMinutes,
      };
    });
  }, [totalFocus]);

  const totalWeeklyFocus = weeklyData.reduce(
    (sum, item) => sum + item.focusMinutes,
    0
  );

  const chartConfig = {
    focusMinutes: {
      label: "minutes",
      color: "var(--chart-3)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Focus Report</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total Focus Time: {totalWeeklyFocus} minutes
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" />
            {/* <YAxis /> */}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="focusMinutes" fill="var(--color-focusMinutes)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default function ReportPage() {
  return (
    <main className="p-4 relative">
      <nav className="fixed inset-x-0 top-2 left-2 right-2 flex justify-end z-50">
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto space-y-6 mt-12">
        <h1 className="text-3xl font-bold">Weekly Reports</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <WeeklyReportTodos />
          <WeeklyReportFocus />
        </div>
      </div>
    </main>
  );
}
