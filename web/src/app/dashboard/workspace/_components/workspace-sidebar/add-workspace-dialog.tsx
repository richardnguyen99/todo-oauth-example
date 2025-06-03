"use client";

import React, { type JSX } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
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
import {
  UpdateWorkspaceErrorResponse,
  Workspace,
  WorkspaceResponse,
} from "@/_types/workspace";
import { icons } from "../../_constants/icons";
import { colorList, colorMap } from "../../_constants/colors";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";

const [defaultColor, ...otherColors] = Object.keys(
  colorMap,
) as (keyof typeof colorMap)[];

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
    .enum([defaultColor, ...otherColors])
    .refine((value) => colorList.some((c) => c.name === value), {
      message: "Please select a valid color",
    }),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

type Props = Readonly<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export default function SidebarAddWorkspaceDialog({
  open,
  setOpen,
}: Props): JSX.Element {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      icon: "Folder",
      color: "green",
    },
  });

  const { workspaces, setWorkspaces } = useWorkspaceStore((s) => s);
  const { mutate } = useMutation({
    mutationKey: ["add-workspace"],
    mutationFn: async (newWorkspace: {
      title: string;
      color: string;
      icon: string;
    }) => {
      const response = await api.post<WorkspaceResponse>(
        "/workspaces",
        newWorkspace,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },

    onSuccess: async (data) => {
      // Invalidate the query to refetch the workspaces
      await queryClient.invalidateQueries({
        queryKey: ["fetch-workspace"],
      });
      await invalidateWorkspaces();

      const newWorkspace: Workspace = {
        ...data.data,
        createdAt: new Date(data.data.createdAt),
        updatedAt: new Date(data.data.updatedAt),

        members: data.data.members.map((member) => ({
          ...member,
          createdAt: new Date(member.createdAt),
        })),
      };

      const updatedWorkspaces: Workspace[] = [...workspaces, newWorkspace];

      setWorkspaces({
        workspaces: updatedWorkspaces,
        activeWorkspace: newWorkspace,
        status: "success",
      });

      push(`/dashboard/workspace/${newWorkspace._id}`);
      setOpen(false);
    },

    onSettled: () => {},

    onError: (error: AxiosError<UpdateWorkspaceErrorResponse>) => {
      form.setError("root.badRequest", {
        type: "400",
        message: error.response?.data.message,
      });
    },
  });

  // Watch form values for preview
  const watchedValues = form.watch();
  const SelectedIconComponent = icons[watchedValues.icon];

  // Get the selected color name for display
  const selectedColorName =
    colorList.find((c) => c.name === watchedValues.color)?.name || "Color";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your tasks and projects.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              mutate(values, { onSuccess: () => form.reset() }),
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
                    <Input
                      placeholder="Enter workspace title"
                      {...field}
                      className="w-full"
                    />
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
              <div className="mt-2 flex items-center gap-3 rounded-md border p-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    colorMap[watchedValues.color]
                  }`}
                >
                  <SelectedIconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {watchedValues.title || "Workspace Name"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {selectedColorName} • {watchedValues.icon}
                  </span>
                </div>
              </div>
            </div>

            <div>
              {form.formState.errors.root?.badRequest && (
                <div className="text-sm text-red-500">
                  {form.formState.errors.root?.badRequest.message}
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Workspace</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
