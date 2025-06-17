"use client";

import React, { type JSX } from "react";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { FetchedUser, UsersResponse } from "@/_types/user";
import MemberSearchResultItem from "./member-search-result-item";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";

const FormSchema = z.object({
  userId: z.string({
    required_error: "Please select a language.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function MemberAddDialog(): JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [items, setItems] = React.useState<FetchedUser[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const [selectedItem, setSelectedItem] = React.useState<FetchedUser | null>(
    null,
  );
  const { activeWorkspace, workspaces, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );
  const existingUserIds = React.useMemo(
    () => activeWorkspace?.members.map((member) => member.userId) || [],
    [activeWorkspace],
  );

  const { isFetching } = useQuery<FetchedUser[]>({
    queryKey: ["members", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.trim() === "") {
        setItems([]);
        return [];
      }

      const response = await api.get<UsersResponse>(
        `/users/search?query=${debouncedSearchTerm}`,
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }

      setItems(response.data.data);
      return response.data.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.post(
        `/workspaces/${activeWorkspace!._id}/members`,
        {
          newMemberId: userId,
          role: "member",
        },
      );

      return response;
    },

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: async (res) => {
      await invalidateWorkspaces();
      form.reset();

      const newActiveWorkspace = {
        ...activeWorkspace!,
        members: res.data.data.members.map((member) => ({
          _id: member._id,
          userId: member.userId,
          workspaceId: member.workspaceId,
          role: member.role,
          isActive: member.isActive,
          createdAt: new Date(member.createdAt),
          user: {
            _id: member.user._id,
            username: member.user.username,
            email: member.user.email,
            emailVerified: member.user.emailVerified,
            avatar: member.user.avatar,
          },
        })),
        memberIds: res.data.data.memberIds,

        updatedAt: new Date(res.data.data.updatedAt),
      };

      const newWorkspaces = workspaces.map((workspace) =>
        workspace._id === activeWorkspace!._id ? newActiveWorkspace : workspace,
      );

      console.log("Old active workspace:", activeWorkspace);
      console.log("New active workspace:", newActiveWorkspace);

      setWorkspaces({
        workspaces: newWorkspaces,
        activeWorkspace: newActiveWorkspace,
        status: "success",
      });

      setDialogOpen(false);
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = React.useCallback(
    (data: FormData) => {
      console.log("Form submitted with data:", data);
      mutate(data.userId);
    },
    [mutate],
  );

  const filteredItems = React.useMemo(() => {
    const [nonExisting, existing] = items.reduce(
      (acc, user) => {
        if (existingUserIds.includes(user._id)) {
          acc[1].push(user);
        } else {
          acc[0].push(user);
        }
        return acc;
      },
      [[], []] as [FetchedUser[], FetchedUser[]],
    );

    return { nonExisting, existing };
  }, [existingUserIds, items]);

  if (!activeWorkspace) {
    return (
      <Button variant="secondary" className="p-2">
        <UserPlus className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Invite Member</span>
      </Button>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="p-2">
          <UserPlus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Invite Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite new members to your workspace to work with you.
            </DialogDescription>

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Member</FormLabel>
                  <Popover
                    modal
                    open={popoverOpen}
                    onOpenChange={(newValue) => {
                      setPopoverOpen(newValue);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {selectedItem
                            ? selectedItem.email
                            : "Type to search for a user..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                        />
                        <CommandList
                          className={cn({
                            "[&_[cmdk-empty]]:opacity-50":
                              debouncedSearchTerm !== searchTerm || isFetching,
                            "[&_[cmdk-empty]]:opacity-100":
                              debouncedSearchTerm === searchTerm && !isFetching,
                          })}
                        >
                          <CommandEmpty>
                            {debouncedSearchTerm
                              ? "No results found."
                              : "Type to search..."}
                          </CommandEmpty>

                          {filteredItems.nonExisting.length > 0 && (
                            <CommandGroup
                              heading="Invite New Members"
                              className={cn({
                                "opacity-50":
                                  debouncedSearchTerm !== searchTerm ||
                                  isFetching,
                                "opacity-100":
                                  debouncedSearchTerm === searchTerm &&
                                  !isFetching,
                              })}
                            >
                              {filteredItems.nonExisting.map((user) => (
                                <MemberSearchResultItem
                                  key={user._id}
                                  user={user}
                                  handleSelect={(userId) => {
                                    setSelectedItem(user);
                                    form.setValue("userId", userId);
                                    setPopoverOpen(false);
                                  }}
                                  checked={selectedItem?._id === user._id}
                                  disabled={false}
                                />
                              ))}
                            </CommandGroup>
                          )}

                          {filteredItems.existing.length > 0 && (
                            <CommandGroup
                              heading="Existing Members"
                              className={cn({
                                "opacity-50":
                                  debouncedSearchTerm !== searchTerm ||
                                  isFetching,
                                "opacity-100":
                                  debouncedSearchTerm === searchTerm &&
                                  !isFetching,
                              })}
                            >
                              {filteredItems.existing.map((user) => (
                                <MemberSearchResultItem
                                  key={user._id}
                                  user={user}
                                  handleSelect={(userId) => {
                                    setSelectedItem(user);
                                    form.setValue("userId", userId);
                                    setPopoverOpen(false);
                                  }}
                                  checked={selectedItem?._id === user._id}
                                  disabled
                                />
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This user will be invited to work with you in your
                    workspace.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="reset"
                variant="secondary"
                onClick={() => {
                  setDialogOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
