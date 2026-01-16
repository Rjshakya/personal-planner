"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  PartyPopper,
} from "lucide-react";
import { endOfDay, format, isEqual, startOfDay } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/stores/todoStore";
import { DatePicker } from "@/components/date-picker";

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

export const TodoComponent = ({ className }: { className?: string }) => {
  const {
    todos,
    addTodo: storeAddTodo,
    toggleDone,
    deleteTodo,
    updateTodo,
  } = useTodoStore();
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString());
  const [hide, sethide] = useState(true);
  const [isTodayTasksDone, setIsTodaysTasksDone] = useState(false);

  const addTodo = () => {
    if (!newTitle.trim()) return;
    storeAddTodo(newTitle, newDate || "Today");
    setNewTitle("");
    setNewDate(newDate);
  };

  useEffect(() => {
    if (!todos || todos.length === 0) return;

    (() => {
      const allDone = todos.every((todo) => todo.done);
      setIsTodaysTasksDone(allDone);
    })();
  }, [todos, toggleDone]);

  return (
    <div className={cn(` p-1 flex flex-col gap-8 `, className)}>
      <div className=" text-xs px-0.5 my-4 flex items-center justify-between text-muted-foreground ">
        {`[ ${format(new Date(), "EEEE - dd/MM/yyyy")} ]`}
      </div>
      <Card className=" ring-0 shadow-none">
        <CardHeader className="mb-4">
          <CardTitle className="font-bold text-xl flex items-center justify-between">
            <p>Tasks</p>
            <div className=" flex items-center gap-2">
              <Button size={"sm"} onClick={() => sethide(!hide)}>
                {hide ? "show" : "hide"}
              </Button>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button size={"icon-sm"}>
                      <Plus />
                    </Button>
                  }
                />
                <DialogContent className={"p-0"}>
                  <div className="grid gap-2 bg-card p-12">
                    <Input
                      placeholder="New task..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <DatePicker
                      date={new Date(newDate)}
                      setDate={(date) => {
                        if (!date) return;
                        setNewDate(date.toISOString());
                      }}
                      label="Date"
                    />
                    <Button onClick={addTodo} size="lg" className={"mt-2"}>
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className=" grid gap-6 min-h-[10vh]">
          {todos.map((todo) => {
            if (
              !isEqual(
                new Date(todo.date).toDateString(),
                new Date().toDateString()
              )
            )
              return null;

            if (!hide && todo.done) {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleDone}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              );
            } else if (hide && !todo.done) {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleDone}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              );
            }
          })}

          {isTodayTasksDone && (
            <div className="border-2 p-3 flex items-center gap-4">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#ff6900"
                  viewBox="0 0 256 256"
                >
                  <path d="M111.49,52.63a15.8,15.8,0,0,0-26,5.77L33,202.78A15.83,15.83,0,0,0,47.76,224a16,16,0,0,0,5.46-1l144.37-52.5a15.8,15.8,0,0,0,5.78-26ZM65.14,161.13l19.2-52.79,63.32,63.32-52.8,19.2ZM160,72a37.8,37.8,0,0,1,3.84-15.58C169.14,45.83,179.14,40,192,40c6.7,0,11-2.29,13.65-7.21A22,22,0,0,0,208,23.94,8,8,0,0,1,224,24c0,12.86-8.52,32-32,32-6.7,0-11,2.29-13.65,7.21A22,22,0,0,0,176,72.06,8,8,0,0,1,160,72ZM136,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm101.66,82.34a8,8,0,1,1-11.32,11.31l-16-16a8,8,0,0,1,11.32-11.32Zm4.87-42.75-24,8a8,8,0,0,1-5.06-15.18l24-8a8,8,0,0,1,5.06,15.18Z"></path>
                </svg>
              </span>
              Congratulations you have completed all your tasks today.
            </div>
          )}

          {todos.filter((t) => {
            const start = startOfDay(new Date());
            const end = endOfDay(new Date());

            const todoDate = new Date(t.date);

            if (todoDate >= start && todoDate <= end) {
              return true;
            }

            return false;
          }).length === 0 && (
            <div className="border-2 p-3 flex items-center gap-4">
              Please set your task for today
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TodoItem>) => void;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDate, setEditDate] = useState(new Date(todo.date));
  const [done, setDone] = useState(todo.done);

  const saveEdit = () => {
    onUpdate(todo.id, { title: editTitle, date: editDate.toISOString() });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditDate(new Date(todo.date));
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-4 group">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={done}
        onCheckedChange={() => {
          setDone(!done);
          setTimeout(() => {
            onToggle(todo.id);
          }, 500);
        }}
      />
      <div className="flex-1">
        {isEditing ? (
          <div className="grid gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
            <DatePicker
              date={new Date(todo.date)}
              label="Date"
              setDate={(date) => {
                if (!date) return;
                setEditDate(date);
              }}
            />
            <div className="flex gap-2">
              <Button onClick={saveEdit} size="sm">
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={cancelEdit} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Label htmlFor={`todo-${todo.id}`} className="grid gap-1">
            <p className={done ? "line-through text-muted-foreground" : ""}>
              {todo.title}
            </p>
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <Calendar size={12} strokeWidth={3} />
              <p className="mt-1">{format(todo.date, "PPP")}</p>
            </span>
          </Label>
        )}
      </div>
      {!isEditing && (
        <div className="flex gap-1  transition-opacity">
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => onDelete(todo.id)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
