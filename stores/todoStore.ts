import "client-only";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date: string;
  createdAt: string;
  doneAt: string | null;
}

interface TodoStore {
  todos: TodoItem[];
  totalFocus: Record<string, number>; // key: day (YYYY-MM-DD), value: seconds
  addTodo: (title: string, date: string) => void;
  toggleDone: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  addFocus: (day: string, seconds: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
}

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === "undefined") return;
    console.log(name, "has been deleted");
    await del(name);
  },
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      totalFocus: {},
      addTodo: (title: string, date: string) => {
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          title,
          done: false,
          date: date || "Today",
          createdAt: new Date().toISOString(),
          doneAt: null,
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },
      toggleDone: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  done: !todo.done,
                  doneAt: !todo.done ? new Date().toISOString() : null,
                }
              : todo
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
      addFocus: (day: string, seconds: number) => {
        set((state) => ({
          totalFocus: {
            ...state.totalFocus,
            [day]: (state.totalFocus[day] || 0) + seconds,
          },
        }));
      },

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "todo-storage", // key for localStorage
      partialize: (state) => ({
        todos: state.todos,
        totalFocus: state.totalFocus,
      }),
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
