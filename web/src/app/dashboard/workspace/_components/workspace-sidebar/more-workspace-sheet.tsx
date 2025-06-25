import React, { type JSX } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workspace } from "@/_types/workspace";
import { Color } from "@/_types/color";
import { colorMap } from "../../_constants/colors";
import { cn } from "@/lib/utils";
import DeleteWorkspaceDialog from "./delete-workspace-dialog";
import UpdateWorkspaceDialog from "./update-workspace-dialog";

type Props = Readonly<{
  workspaces: Workspace[];
}>;

export default function SidebarMoreWorkspaceSheet({
  workspaces,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const { isMobile } = useSidebar();
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null);

  const renderIcon = (icon: string, color: Color) => {
    const Icon = LucideIcons[
      icon as keyof typeof LucideIcons
    ] as React.ComponentType<LucideIcons.LucideProps>;

    return (
      <div
        className={cn(
          "flex aspect-square size-6 items-center justify-center rounded",
          colorMap[color],
        )}
      >
        <Icon className="size-4" />
      </div>
    );
  };

  React.useEffect(() => {
    if (!isMobile) {
      const containerElement = document.querySelector(
        "[data-sidebar='sidebar-sheet-container']",
      ) as HTMLElement;

      setContainer(containerElement);
    }
  }, [isMobile]);

  return (
    <>
      <Sheet
        data-sidebar="sidebar-sheet"
        modal
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SheetTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70 cursor-pointer">
              <>
                <LucideIcons.MoreHorizontal className="text-sidebar-foreground/70" />
                <span>more</span>
              </>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SheetTrigger>

        <SheetContent
          className="md:h-[calc(100%-112px)] [&>button:last-child]:hidden"
          side="left"
          container={container}
        >
          <SheetHeader className="pb-2">
            <SheetTitle asChild>
              <div className="flex items-center justify-between">
                <h3 className="text font-semibold">More workspaces</h3>
                <div className="flex items-center gap-2">
                  <Tooltip disableHoverableContent>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 cursor-pointer"
                            tabIndex={-1}
                          >
                            <span className="sr-only">Sort</span>
                            <LucideIcons.ArrowUpDown className="text-sidebar-foreground/70" />
                          </Button>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-56 text-sm *:cursor-pointer *:text-sm"
                      >
                        <DropdownMenuItem>
                          <LucideIcons.AlignLeft className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">Manual</span>
                          <LucideIcons.Check className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <LucideIcons.History className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">
                            Modified time
                          </span>
                          <LucideIcons.Check className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <LucideIcons.Users className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">
                            Number of members
                          </span>
                          <LucideIcons.Check className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>

                      <TooltipContent container={container}>
                        Sort
                      </TooltipContent>
                    </DropdownMenu>
                  </Tooltip>

                  <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild>
                      <SheetClose asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 cursor-pointer"
                          tabIndex={-1}
                        >
                          <span className="sr-only">Close</span>
                          <LucideIcons.X className="text-sidebar-foreground/70" />
                        </Button>
                      </SheetClose>
                    </TooltipTrigger>

                    <TooltipContent container={container}>
                      Close sheet
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </SheetTitle>

            <SheetDescription asChild>
              <p className="text-muted-foreground">
                You can add up to 5 workspaces. To add more, please{" "}
                <a
                  href="https://taskmaster.dev/pricing"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  upgrade your plan
                </a>
                .
              </p>
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-1 px-2 text-sm">
            {workspaces.map((ws) => (
              <div
                key={ws._id}
                className="group hover:bg-accent/50 relative rounded px-2 py-1 transition-colors"
              >
                <Link
                  className=""
                  href={`/dashboard/workspace/${ws._id}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {renderIcon(ws.icon, ws.color)}
                    <span className="line-clamp-1 w-[calc(100%-2.5rem)] group-hover:w-[calc(100%-4rem)]">
                      {ws.title}
                    </span>
                  </div>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1.5 right-1.5 size-5 cursor-pointer opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                    >
                      <LucideIcons.MoreHorizontal className="size-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="relative z-[51] rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <LucideIcons.Star className="text-muted-foreground" />
                      <span>Add To Favorites</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onSelect={() => {
                        setUpdateDialogOpen(true);
                        setIsOpen(false);
                        setWorkspace(ws);
                      }}
                    >
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

                    <DropdownMenuItem
                      onSelect={() => {
                        setDeleteDialogOpen(true);
                        setIsOpen(false);
                        setWorkspace(ws);
                      }}
                    >
                      <LucideIcons.Trash2 className="text-muted-foreground" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {workspace && (
        <UpdateWorkspaceDialog
          show={updateDialogOpen}
          setShow={setUpdateDialogOpen}
          workspace={workspace}
          onClose={() => setWorkspace(null)}
        />
      )}

      {workspace && (
        <DeleteWorkspaceDialog
          show={deleteDialogOpen}
          setShow={setDeleteDialogOpen}
          workspace={workspace}
          onClose={() => setWorkspace(null)}
        />
      )}
    </>
  );
}
