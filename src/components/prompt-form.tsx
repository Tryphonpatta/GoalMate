"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Todo } from "./todo-list";

export default function PromptForm({
  todos,
  setTodo,
}: {
  todos: Todo[];
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
}) {
  const [prompt, setPrompt] = useState("");
  const [goal, setGoal] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // const { text } = await generateText({
      //   model: openai("gpt-4o"),
      //   prompt: `Based on this context: "${prompt}", suggest a specific, actionable goal or task that would be meaningful to add to a todo list. Keep it concise (under 100 characters) and make it specific enough to be actionable.`,
      // });
      // setGoal(text);
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: prompt }),
      });
      const data = await response.json();
      console.log(data[0].todo);
      setGoal(
        data.map((item: { todo: string }) => ({
          id: Date.now() + Math.random(),
          text: item.todo,
          completed: false,
          createdAt: new Date().toISOString(),
        }))
      );
    } catch (err) {
      setError("Failed to generate a goal. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToTodoList = (targetGoal: string) => {
    if (!goal) return;

    // Get existing todos from localStorage
    // const existingTodos = JSON.parse(localStorage.getItem("todos") || "[]");

    // Add new todo
    const newTodo: Todo = {
      id: Date.now(),
      text: targetGoal,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Save updated todos
    // localStorage.setItem("todos", JSON.stringify([...existingTodos, newTodo]));
    setTodo([...todos, newTodo]);
    setGoal(goal.filter((item) => item.text !== targetGoal));
    // Reset goal
    // setGoal("");
    setPrompt("");

    // Trigger a custom event to notify the TodoList component
    window.dispatchEvent(new Event("todosUpdated"));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            What are you looking to accomplish?
          </label>
          <Input
            id="prompt"
            placeholder="e.g., I want to be more productive at work"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Goal
            </>
          )}
        </Button>
      </form>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* {goal && (
        <Card className="p-4 bg-muted/50">
          <h3 className="text-sm font-medium mb-2">AI Suggested Goal:</h3>
          <p className="text-primary font-medium">{goal}</p>
          <Button
            onClick={addToTodoList}
            variant="outline"
            size="sm"
            className="mt-3 w-full"
          >
            Add to Todo List
          </Button>
        </Card>
      )} */}
      {goal.length > 0 &&
        goal.map((item: Todo) => {
          return (
            <Card className="p-4 bg-muted/50" key={item.id}>
              <h3 className="text-sm font-medium mb-2">AI Suggested Goal:</h3>
              <p className="text-primary font-medium">{item.text}</p>
              <Button
                onClick={() => addToTodoList(item.text)}
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                Add to Todo List
              </Button>
            </Card>
          );
        })}
    </div>
  );
}
