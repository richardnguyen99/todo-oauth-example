"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { TaskResponse } from "../_types/task";
import { useTaskStore } from "../_providers/task";

// Define the task schema with zod
const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(80, "Title must be less than 80 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level",
  }),
});

// Define the form values type
type TaskFormValues = z.infer<typeof taskSchema>;

type Props = Readonly<{} & React.HTMLAttributes<HTMLButtonElement>>;

export function TaskCreator({ className, ...rest }: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { setTasks, tasks } = useTaskStore((s) => s);

  const { mutate } = useMutation({
    mutationKey: ["addTask", activeWorkspace?._id],
    mutationFn: async (taskData: TaskFormValues) => {
      if (!activeWorkspace?._id) {
        throw new Error("No active workspace found");
      }

      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000),
      );

      const response = await api.post<TaskResponse>(
        `/tasks/new?workspace_id=${activeWorkspace._id}`,
        {
          ...taskData,
          workspaceId: activeWorkspace._id,
        },
      );

      return response.data;
    },

    onSuccess: (response) => {
      const newTask = {
        ...response.data,
        dueDate: response.data.dueDate ? new Date(response.data.dueDate) : null,
      };
      setTasks([...tasks, newTask]);
    },

    onSettled: () => {
      setLoading(false);
    },

    onError: (error) => {
      console.error("Error adding task:", error);
    },
  });

  // Initialize the form with default values
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          {...rest}
          variant="secondary"
          className={cn("mt-1 h-16 w-full cursor-pointer gap-2", className)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task in your workspace. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              mutate(values, {
                onSuccess: () => {
                  form.reset();
                  setOpen(false);
                },
              });
            })}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of your task (1-80 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional details about the task (max 200 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the importance level of this task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>Add Task</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
