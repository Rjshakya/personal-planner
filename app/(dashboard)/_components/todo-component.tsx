"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { format } from "date-fns";
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
  const today = new Date();

  const addTodo = () => {
    if (!newTitle.trim()) return;
    storeAddTodo(newTitle, newDate || "Today");
    setNewTitle("");
    setNewDate("");
  };

  return (
    <div
      className={cn(
        `bg-amber-300 dark:bg-amber-900 shadow-sm p-1 flex flex-col gap-2 `,
        className
      )}
    >
      <div className=" text-xs  py-1 px-0.5 flex items-center justify-between text-muted-foreground font-bold ">
        {format(today, "EEEE - dd/MM/yyyy")}
        <Dialog>
          <DialogTrigger
            render={
              <Button size={"icon-sm"}>
                <Plus />
              </Button>
            }
          />
          <DialogContent className={"p-0"}>
            <div className="grid gap-2  bg-card p-8">
              <Input
                placeholder="New task..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
              />
              {/* <Input
                placeholder="Date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                type="date"
              /> */}
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
      <Card className=" ring-0 h-full">
        <CardHeader className="mb-4">
          <CardTitle className="font-bold text-xl">Tasks</CardTitle>
        </CardHeader>
        <CardContent className=" grid gap-6">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleDone}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
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
        checked={todo.done}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <div className="flex-1">
        {isEditing ? (
          <div className="grid gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            />
            {/* <Input
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              placeholder="Date"
              type="date"
            /> */}
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
            <p
              className={todo.done ? "line-through text-muted-foreground" : ""}
            >
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
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
