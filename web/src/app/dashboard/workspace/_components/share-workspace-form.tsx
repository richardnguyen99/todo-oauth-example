"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileWarning, TriangleAlert, UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

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
import api from "@/lib/axios";
import { useMemberStore } from "../../_providers/member";
import { AddMemberResponse, Member } from "../_types/member";
import { cn } from "@/lib/utils";

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

interface ShareWorkspaceFormProps {
  onCancel: () => void;
  workspaceTitle?: string;
  workspaceId: string;
}

export default function ShareWorkspaceForm({
  onCancel,
  workspaceTitle = "this workspace",
  workspaceId,
}: ShareWorkspaceFormProps) {
  const queryClient = useQueryClient();
  const { members, setMembers } = useMemberStore((s) => s);

  const { mutate } = useMutation({
    mutationKey: ["inviteUser"],
    mutationFn: async (values: FormValues) => {
      const response = await api.post<any, AxiosResponse<AddMemberResponse>>(
        `/workspaces/${workspaceId}/add_member`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", workspaceId],
      });

      data.data.createdAt = new Date(data.data.createdAt);
      data.data.updatedAt = new Date(data.data.updatedAt);

      setMembers([...members, data.data]);
    },

    onError: (error: AxiosError) => {
      form.setError("root.badRequest", {
        type: "400",
        message: (error.response?.data as any).message,
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
          })
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
                  <SelectTrigger className="w-30 mt-2">
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
                  <TriangleAlert className="inline mr-1 h-4 w-4 text-amber-500 dark:text-amber-400" />
                )}
                {roles.find((r) => r.value === form.watch("role"))?.description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
