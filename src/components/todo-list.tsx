"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

export interface Todo {
  id: number;
  text?: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoList({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}) {
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newTodo.trim()}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
      </form>

      <div className="space-y-1">
        {todos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Your todo list is empty. Add a task or generate a goal!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-md border ${
                todo.completed ? "bg-muted/50" : "bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                <div>
                  <p
                    className={
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {todo.text}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(todo.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
