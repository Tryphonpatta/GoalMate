"use client";
import { Suspense, useState } from "react";
import TodoList, { Todo } from "@/components/todo-list";
import PromptForm from "@/components/prompt-form";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
              AI-Powered Todo List
            </h1>
            <p className="text-muted-foreground">
              Enter a prompt and let AI suggest goals for your todo list
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-sm p-6 border">
                <h2 className="text-xl font-semibold mb-4">Generate a Goal</h2>
                <Suspense fallback={<div>Loading prompt form...</div>}>
                  <PromptForm todos={todos} setTodo={setTodos} />
                </Suspense>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Your Todo List</h2>
              <Suspense fallback={<div>Loading todo list...</div>}>
                <TodoList todos={todos} setTodos={setTodos} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
