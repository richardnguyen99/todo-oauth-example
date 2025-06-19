"use client";

import React, { type JSX } from "react";
import {
  Calendar,
  CircleHelp,
  CornerDownRight,
  Loader2,
  Mail,
  MoreHorizontal,
  Trash,
  UserRoundPen,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Workspace } from "@/_types/workspace";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/providers/user-store-provider";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import api from "@/lib/axios";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";
import { useRouter } from "next/navigation";

type Props = Readonly<{
  member: Workspace["members"][number];
}>;

const getRoleColor = (role: Props["member"]["role"]) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800 border-purple-800 dark:bg-purple-950/50 dark:text-purple-500 hover:bg-purple-500";
    case "admin":
      return "bg-blue-100 text-blue-800 border-blue-800 dark:bg-blue-950/50 dark:text-blue-500 hover:bg-blue-500";
    case "member":
      return "bg-green-100 text-green-800 border-green-800 dark:bg-green-950/50 dark:text-green-500 hover:bg-green-500";
    default:
      return "bg-gray-100 text-gray-800 border-gray-800 dark:bg-gray-950/50 dark:text-gray-500 hover:bg-gray-500";
  }
};

const getActiveColor = (status: Props["member"]["isActive"]) => {
  return status
    ? "dark:bg-green-950 dark:border-green-500 dark:text-green-500 bg-green-50 border-green-400 text-green-400"
    : "bg-red-100 text-red-800";
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formSchema = z.object({
  role: z.string({
    required_error: "Please select an email to display.",
  }),
});

function MemberItem({ member }: Props): JSX.Element {
  const router = useRouter();
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const { user } = useUserStore((s) => s);
  const { activeWorkspace, workspaces, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: member.role,
    },
  });

  const canRemoveMembers = React.useMemo(() => {
    // is the current user the owner of the workspace
    if (user?.id === activeWorkspace?.ownerId) {
      return member.role !== "owner";
    }

    // is the current user the member themselves
    if (user?.id === member.userId) {
      return true;
    }

    // is the current user an admin
    if (
      activeWorkspace?.members.find(
        (m) => m.userId === user?.id && m.role === "admin",
      )
    ) {
      return member.role !== "owner" && member.role !== "admin";
    }

    return false;
  }, [activeWorkspace?.members, activeWorkspace?.ownerId, member, user?.id]);

  const { mutate: updateMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.put(
        `/workspaces/${member.workspaceId}/members/${member._id}`,
        {
          role: values.role,
        },
      );

      return res.data;
    },

    onMutate: () => {
      setUpdateLoading(true);
    },

    onSuccess: async (data) => {
      await invalidateWorkspaces();

      const newActiveWorkspace = {
        ...activeWorkspace!,
        members: activeWorkspace!.members.map((m) => {
          if (m._id === member._id) {
            return {
              ...data.data,
              createdAt: new Date(data.data.createdAt),
              updatedAt: new Date(data.data.updatedAt),
            };
          }

          return m;
        }),
      };

      const newWorkspaces = workspaces.map((workspace) => {
        if (workspace._id === activeWorkspace?._id) {
          return newActiveWorkspace;
        }
        return workspace;
      });

      setWorkspaces({
        workspaces: newWorkspaces,
        activeWorkspace: newActiveWorkspace,
        status: "success",
      });

      setUpdateDialogOpen(false);
      setUpdateLoading(false);
      form.reset({
        role: data.data.role,
      });
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(
        `/workspaces/${member.workspaceId}/members/${member._id}`,
      );

      return res.data;
    },

    onMutate: () => {
      setDeleteLoading(true);
    },

    onSuccess: async () => {
      await invalidateWorkspaces();

      // if the current user is the member being deleted

      if (user?.id === member.userId) {
        // reset the active workspace to null
        setWorkspaces({
          workspaces: workspaces.filter((w) => w._id !== activeWorkspace?._id),
          activeWorkspace: null,
          status: "success",
        });

        router.push("/dashboard/workspace");
      } else {
        const newActiveWorkspace = {
          ...activeWorkspace!,
          members: activeWorkspace!.members.filter((m) => m._id !== member._id),
        };

        const newWorkspaces = workspaces.map((workspace) => {
          if (workspace._id === activeWorkspace?._id) {
            return newActiveWorkspace;
          }
          return workspace;
        });

        setWorkspaces({
          workspaces: newWorkspaces,
          activeWorkspace: newActiveWorkspace,
          status: "success",
        });

        setDeleteLoading(false);
        setAlertDialogOpen(false);
        form.reset();
      }
    },
  });

  const renderTooltipContent = () => {
    if (user?.id === activeWorkspace?.ownerId) {
      if (member.role === "owner") {
        return <p>Switching roles as owner is currently not supported.</p>;
      }

      return (
        <ul className="space-y-1">
          <li>
            <p>
              <strong>Admin:</strong> Permissions to create, edit, delete and
              assign tasks; manage members and workspace settings with
              limitations.
            </p>
          </li>

          <li>
            <p>
              <strong>Member:</strong> Permissions to create, edit, delete and
              assign tasks.
            </p>
          </li>
        </ul>
      );
    }

    if (user?.id === member.userId) {
      return (
        <p>
          You are currently viewing your own role. You cannot change your own
          role.
        </p>
      );
    }

    return (
      <p>
        You do not have permission to change roles in this workspace. Please
        contact the owner for assistance.
      </p>
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutate(values);
  };

  const onDeleteSelect = () => {
    deleteMutate();
  };

  return (
    <React.Fragment key={member._id}>
      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors">
        <div className="flex items-center space-x-4">
          <Avatar className="bg-accent h-10 w-10">
            <AvatarImage src={member.user.avatar} alt={member.user.username} />
            <AvatarFallback>{getInitials(member.user.username)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-primary truncate text-sm font-medium">
                {member.user.username}
              </p>
              <Badge
                variant="secondary"
                className={getActiveColor(member.isActive)}
              >
                {member.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Mail className="h-3 w-3" />
                <span className="truncate">{member.user.email}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Joined {formatDate(member.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getRoleColor(member.role)}>
            {member.role}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7 rounded-md">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setUpdateDialogOpen(true)}>
                <UserRoundPen className="size-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CornerDownRight className="size-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={!canRemoveMembers}
                onSelect={() => setAlertDialogOpen(true)}
              >
                <Trash className="size-4" />
                {user?.id === member.userId
                  ? "Leave Workspace"
                  : "Remove Member"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog
        open={updateDialogOpen}
        onOpenChange={(val) => {
          setUpdateDialogOpen(val);
          form.reset();
        }}
      >
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogTitle>Edit Member</DialogTitle>
              <DialogDescription>
                Make changes to the member details.
              </DialogDescription>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel>Role</FormLabel>
                      <Tooltip disableHoverableContent>
                        <TooltipTrigger tabIndex={-1} type="button">
                          <CircleHelp className="h-4 w-4 text-gray-500" />
                          <span className="sr-only">Help</span>
                        </TooltipTrigger>
                        <TooltipContent
                          align="start"
                          side="right"
                          className="w-48"
                        >
                          {renderTooltipContent()}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem disabled value="owner">
                            Owner
                          </SelectItem>
                          <SelectItem
                            disabled={
                              user?.id !== activeWorkspace?.ownerId ||
                              member.role === "owner"
                            }
                            value="admin"
                          >
                            Admin
                          </SelectItem>
                          <SelectItem
                            disabled={
                              user?.id !== activeWorkspace?.ownerId ||
                              member.role === "owner"
                            }
                            value="member"
                          >
                            Member
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the role for this member in the workspace.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type={form.formState.isDirty ? "submit" : "button"}
                  variant={form.formState.isDirty ? "default" : "outline"}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            member from the workspace.
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={onDeleteSelect}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : null}
              {user?.id === member.userId ? "Leave" : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

const MemoMemberItem = React.memo(MemberItem, (prevProps, nextProps) => {
  return (
    prevProps.member._id === nextProps.member._id &&
    prevProps.member.role === nextProps.member.role &&
    prevProps.member.isActive === nextProps.member.isActive &&
    prevProps.member.userId === nextProps.member.userId &&
    prevProps.member.workspaceId === nextProps.member.workspaceId
  );
});

export default MemoMemberItem;
