"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/stores/todoStore";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const POMODORO_DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

const PomodoroCard = () => {
  const { addFocus } = useTodoStore();
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          if (newTime === 0) {
            setIsRunning(false);
            if (mode === "work") {
              const newCount = pomodoroCount + 1;
              setPomodoroCount(newCount);
              // Add focus time for completed work session (25 minutes)
              if (newCount % 4 === 0) {
                setMode("longBreak");
                return POMODORO_DURATIONS.longBreak;
              } else {
                setMode("shortBreak");
                return POMODORO_DURATIONS.shortBreak;
              }
            } else {
              setMode("work");
              return POMODORO_DURATIONS.work;
            }
          }
          return newTime;
        });
      }, 1000);
    }

    if (!isRunning && mode === "work") {
      const key = new Date().toISOString().split("T")[0];
      addFocus(key, POMODORO_DURATIONS.work - timeLeft);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, pomodoroCount, addFocus]);

  const startPause = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_DURATIONS[mode]);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(POMODORO_DURATIONS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="ring-0 p-10">
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground">
            {mode === "work"
              ? "Focus Time"
              : mode === "shortBreak"
              ? "Short Break"
              : "Long Break"}
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={startPause}
              variant={isRunning ? "secondary" : "default"}
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="flex justify-center gap-1">
            <Button
              onClick={() => changeMode("work")}
              variant={mode === "work" ? "default" : "outline"}
              size="sm"
            >
              Work
            </Button>
            <Button
              onClick={() => changeMode("shortBreak")}
              variant={mode === "shortBreak" ? "default" : "outline"}
              size="sm"
            >
              Short Break
            </Button>
            <Button
              onClick={() => changeMode("longBreak")}
              variant={mode === "longBreak" ? "default" : "outline"}
              size="sm"
            >
              Long Break
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Pomodoros completed: {pomodoroCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimerCard = () => {
  const { addFocus } = useTodoStore();
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [customTimeLeft, setCustomTimeLeft] = useState(5 * 60);
  const [isCustomRunning, setIsCustomRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCustomRunning && customTimeLeft > 0) {
      interval = setInterval(() => {
        setCustomTimeLeft((time) => {
          const newTime = time - 1;
          if (newTime === 0) {
            setIsCustomRunning(false);
          }
          return newTime;
        });
      }, 1000);
    }

    if (!isCustomRunning) {
      const key = new Date().toISOString().split("T")[0];
      addFocus(key, (customMinutes * 60 + customSeconds) - customTimeLeft);
    }

    return () => clearInterval(interval);
  }, [isCustomRunning, customTimeLeft, addFocus]);

  const startCustomTimer = () => {
    const totalSeconds = customMinutes * 60 + customSeconds;
    setCustomTimeLeft(totalSeconds);
    setIsCustomRunning(true);
  };

  const pauseCustomTimer = () => {
    setIsCustomRunning(false);
  };

  const resetCustomTimer = () => {
    setIsCustomRunning(false);
    setCustomTimeLeft(customMinutes * 60 + customSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="ring-0 p-10">
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-mono font-bold">
            {formatTime(customTimeLeft)}
          </div>
          <div className="text-sm text-muted-foreground">Focus Time</div>
          <div className="flex justify-center gap-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value) || 0)}
                className="w-16"
                min="0"
              />
              <Input
                type="number"
                placeholder="Sec"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(Number(e.target.value) || 0)}
                className="w-16"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={isCustomRunning ? pauseCustomTimer : startCustomTimer}
              variant={isCustomRunning ? "secondary" : "default"}
            >
              {isCustomRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isCustomRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetCustomTimer} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PomodoroComponent = ({ className }: { className?: string }) => {
  const today = new Date();

  return (
    <div
      className={cn(
        `bg-amber-300 dark:bg-amber-900 shadow-sm p-1 flex flex-col gap-2`,
        className
      )}
    >
      <div className=" text-xs  py-1 px-0.5 flex items-center justify-between text-muted-foreground font-bold ">
        {/* {format(today, "EEEE - dd/MM/yyyy")} */}
      </div>
      <Tabs defaultValue="pomodoro" className="w-full ">
        <TabsList className="grid w-full grid-cols-2  ">
          <TabsTrigger className={"cursor-pointer "} value="pomodoro">
            Pomodoro
          </TabsTrigger>
          <TabsTrigger className={"cursor-pointer "} value="timer">
            Timer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pomodoro" className="space-y-4">
          <PomodoroCard />
        </TabsContent>
        <TabsContent value="timer" className="space-y-4">
          <TimerCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
