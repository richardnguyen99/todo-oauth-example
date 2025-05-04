"use client";

import React, { type JSX } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TriangleAlert, UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { WorkspaceErrorResponse } from "../_types/workspace";
import { useWorkspaceStore } from "../../_providers/workspace";
import {
  Workspace,
  WorkspaceResponse,
  WorkspacesResponse,
} from "@/_types/workspace";

// Define the available roles
const roles = [
  {
    label: "Admin",
    value: "admin",
    description: "Can edit workspace settings and manage members",
  },
  { label: "Member", value: "member", description: "Can view and edit tasks" },
];

// Create a Zod schema for form validation
const formSchema = z.object({
  newMemberId: z.string().min(1, "User handle is required"),
  role: z.enum(["admin", "member"], {
    required_error: "Please select a role",
  }),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

type Props = Readonly<{
  onCancel: () => void;
  workspaceTitle?: string;
  workspaceId: string;
}>;

export default function ShareWorkspaceForm({
  onCancel,
  workspaceTitle = "this workspace",
  workspaceId,
}: Props): JSX.Element {
  const { workspaces, setWorkspaces, setActiveWorkspace } = useWorkspaceStore(
    (s) => s,
  );

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["inviteUser"],
    mutationFn: async (values: FormValues) => {
      const response = await api.post<WorkspaceResponse>(
        `/workspaces/${workspaceId}/members`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      const updatedWorkspace = {
        ...data.data,
        updatedAt: new Date(data.data.updatedAt),
        createdAt: new Date(data.data.createdAt),
        members: data.data.members.map((member) => ({
          ...member,
          createdAt: new Date(member.createdAt),
          user: {
            ...member.user,
          },
        })),
      } satisfies Workspace;

      const updatedWorkspaces = workspaces.map((workspace) =>
        workspace._id === updatedWorkspace._id ? updatedWorkspace : workspace,
      );

      setWorkspaces(updatedWorkspaces);
      setActiveWorkspace(updatedWorkspace);

      queryClient.invalidateQueries({ queryKey: ["fetch-workspace"] });
      queryClient.setQueryData<WorkspacesResponse>(
        ["fetch-workspace"],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedData = {
            ...oldData,
            data: [...oldData.data, data.data],
          };

          return updatedData;
        },
      );
    },

    onError: (error: AxiosError<WorkspaceErrorResponse>) => {
      form.setError("root.badRequest", {
        type: "400",
        message: error.response?.data.message,
      });
    },
  });

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newMemberId: "",
      role: "member",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          mutate(values, {
            onSuccess: () => {
              form.reset();
            },
          }),
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="newMemberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Handle</FormLabel>

              <FormControl>
                <Input
                  className="mt-2"
                  placeholder="user id"
                  autoFocus={false}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>

              <FormDescription>
                Enter a username or email address to invite to {workspaceTitle}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="mt-2 w-30">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription
                className={cn({
                  "text-amber-500 dark:text-amber-400":
                    form.watch("role") === "admin",
                })}
              >
                {form.watch("role") === "admin" && (
                  <TriangleAlert className="mr-1 inline h-4 w-4 text-amber-500 dark:text-amber-400" />
                )}
                {roles.find((r) => r.value === form.watch("role"))?.description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="line-clamp-1 text-xs text-red-400 dark:text-red-500">
          {form.formState.errors.root?.badRequest.message}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </form>
    </Form>
  );
}
