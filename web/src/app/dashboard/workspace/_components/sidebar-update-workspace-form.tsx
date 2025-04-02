"use client";

import React, { type JSX } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AxiosError, AxiosResponse } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorList, colorMap } from "../_constants/colors";
import { icons } from "../_constants/icons";
import { useWorkspaceStore } from "../../_providers/workspace";
import {
  Color,
  UpdateWorkspaceResponse,
  Workspace,
  WorkspaceParams,
} from "../_types/workspace";
import { UpdateMemberResponse } from "../_types/member";
import { Loader2 } from "lucide-react";

// Create a Zod schema for form validation
const formSchema = z.object({
  title: z.string().min(1, "Workspace name is required"),
  icon: z
    .string({
      required_error: "Please select an icon",
    })
    .refine((value) => Object.keys(icons).includes(value), {
      message: "Please select a valid icon",
    }),
  color: z
    .string({
      required_error: "Please select a color",
    })
    .refine((value) => colorList.some((c) => c.name === value), {
      message: "Please select a valid color",
    }),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

interface UpdateWorkspaceFormProps {
  onCancel: () => void;
}

export function UpdateWorkspaceForm({
  onCancel,
}: UpdateWorkspaceFormProps): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const { workspace } = useParams<WorkspaceParams>();
  const { push } = useRouter();
  const { activeWorkspace, setWorkspaces, workspaces } = useWorkspaceStore(
    (s) => s
  );

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activeWorkspace?.title,
      icon: activeWorkspace?.icon,
      color: activeWorkspace?.color,
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["update-workspace"],
    mutationFn: async (newWorkspace: {
      title: string;
      color: string;
      icon: string;
    }) => {
      setLoading(true);

      const response = await api.put<
        any,
        AxiosResponse<UpdateWorkspaceResponse>
      >(`/workspaces/${workspace}/update`, newWorkspace);

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-workspace"] });

      // Update the workspace in the store
      const newWorkspaces = workspaces.map((ws: Workspace) => {
        if (ws._id === data.data._id) {
          // Update the workspace with new values
          return {
            ...ws,
            title: data.data.title,
            icon: data.data.icon,
            color: data.data.color as Color, // Ensure type safety
          };
        }
        return ws;
      });

      setWorkspaces(newWorkspaces);

      push(`/dashboard/workspace/${data.data._id}`);
      onCancel();
    },

    onSettled: () => {
      setLoading(false);
    },

    onError: (error: AxiosError) => {
      form.setError("root.badRequest", {
        type: "400",
        message: (error.response?.data as any).message,
      });
      console.error("Error creating workspace:", error);
    },
  });

  // Watch form values for preview
  const watchedValues = form.watch();
  const SelectedIconComponent = icons[watchedValues.icon];

  // Get the selected color name for display
  const selectedColorName =
    colorList.find((c) => c.name === watchedValues.color)?.name || "Color";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          mutate(values, { onSuccess: () => form.reset() })
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter workspace title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Icons</SelectLabel>
                      {Object.keys(icons).map((iconName) => {
                        const IconComponent = icons[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colors</SelectLabel>
                      {colorList.map((color) => (
                        <SelectItem key={color.name} value={color.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full ${color.value}`}
                            />
                            <span className="capitalize">{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preview */}
        <div className="mt-2">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 mt-2 p-3 border rounded-md">
            <div
              className={`h-8 w-8 rounded-md flex items-center justify-center ${
                // @ts-ignore
                colorMap[watchedValues.color]
              }`}
            >
              <SelectedIconComponent className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {watchedValues.title || "Workspace Name"}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedColorName} • {watchedValues.icon}
              </span>
            </div>
          </div>
        </div>

        <div>
          {form.formState.errors.root?.badRequest && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root?.badRequest.message}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="inline-block h-4 w-4 animate-spin" />
              )}
              Update Workspace
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
