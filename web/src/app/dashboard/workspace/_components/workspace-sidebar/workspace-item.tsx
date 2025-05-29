"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Color } from "@/_types/color";
import { cn } from "@/lib/utils";
import { colorMap } from "../../_constants/colors";
import { Workspace } from "@/_types/workspace";
import UpdateWorkspaceDialog from "../update-workspace-dialog";
import DeleteWorkspaceDialog from "../delete-workspace-dialog";

type Props = Readonly<
  {
    workspace: Workspace;
    isActive: boolean;
  } & React.ComponentProps<typeof SidebarMenuItem>
>;

export default function SidebarWorkspaceItem({
  workspace,
  isActive,
  ...props
}: Props): JSX.Element {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const { isMobile, open } = useSidebar();

  const renderIcon = (icon: string, color: Color) => {
    const Icon = LucideIcons[
      icon as keyof typeof LucideIcons
    ] as React.ComponentType<LucideIcons.LucideProps>;

    return (
      <div
        className={cn(
          "flex aspect-square size-7 items-center justify-center rounded-md",
          colorMap[color],
        )}
      >
        <Icon className="size-5" />
      </div>
    );
  };

  return (
    <SidebarMenuItem {...props}>
      <SidebarMenuButton
        asChild
        className={cn(
          "group-hover/menu-item:!bg-sidebar-accent group-data-[collapsible=icon]:!p-0",
          {
            "bg-sidebar-accent/40": isActive,
          },
        )}
        tooltip={!open ? workspace.title : undefined}
      >
        <Link href={`/dashboard/workspace/${workspace._id}`}>
          {renderIcon(workspace.icon, workspace.color)}
          <span>{workspace.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="cursor-pointer opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100">
            <LucideIcons.MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem>
            <LucideIcons.Star className="text-muted-foreground" />
            <span>Add To Favorites</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setUpdateDialogOpen(true)}>
            <LucideIcons.Pen className="text-muted-foreground" />
            <span>Update</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <LucideIcons.Copy className="text-muted-foreground" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LucideIcons.SquarePen className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
            <LucideIcons.Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-xs" disabled>
            Last modified:{" "}
            {new Date(workspace.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateWorkspaceDialog
        show={updateDialogOpen}
        setShow={setUpdateDialogOpen}
        workspace={workspace}
      />

      <DeleteWorkspaceDialog
        show={deleteDialogOpen}
        setShow={setDeleteDialogOpen}
        workspace={workspace}
      />
    </SidebarMenuItem>
  );
}
