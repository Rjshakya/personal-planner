import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

interface TodoStore {
  todos: TodoItem[];
  addTodo: (title: string, date: string) => void;
  toggleDone: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (title: string, date: string) => {
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          title,
          done: false,
          date: date || "Today",
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },
      toggleDone: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
          ),
        }));
      },
      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      updateTodo: (id: string, updates: Partial<TodoItem>) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }));
      },
    }),
    {
      name: "todo-storage", // key for localStorage
    }
  )
);
