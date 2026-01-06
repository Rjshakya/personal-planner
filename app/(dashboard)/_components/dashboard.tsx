import { CalendarComponent } from "./calendar-component";
import { PomodoroComponent } from "./pomodoro-component";
import { TodoComponent } from "./todo-component";

export const Dashboard = () => {
  return (
    <div
      className="w-full max-w-lg mx-auto   grid  gap-4"
      style={{ scrollbarWidth: "none" }}
    >
      <h2 className="my-4">Personal planner</h2>
      <TodoComponent className="col-span-1 " />
      <PomodoroComponent className="col-span-1" />
      <CalendarComponent className="col-span-1" />
    </div>
  );
};
