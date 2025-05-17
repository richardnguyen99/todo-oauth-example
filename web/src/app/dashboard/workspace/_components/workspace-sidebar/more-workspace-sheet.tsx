import React, { type JSX } from "react";
import {
  AlignLeft,
  ArrowUpDown,
  Check,
  History,
  MoreHorizontal,
  Users,
  X,
} from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  workspaces: Workspace[];
}>;

export default function SidebarMoreWorkspaceSheet({
  workspaces,
}: Props): JSX.Element {
  const { isMobile } = useSidebar();
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

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
      <Sheet data-sidebar="sidebar-sheet" modal>
        <SheetTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70 cursor-pointer">
              <>
                <MoreHorizontal className="text-sidebar-foreground/70" />
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
                            <ArrowUpDown className="text-sidebar-foreground/70" />
                          </Button>
                        </TooltipTrigger>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-56 text-sm *:cursor-pointer *:text-sm"
                      >
                        <DropdownMenuItem>
                          <AlignLeft className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">Manual</span>
                          <Check className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <History className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">
                            Modified time
                          </span>
                          <Check className="ml-auto h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Users className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">
                            Number of members
                          </span>
                          <Check className="ml-auto h-4 w-4" />
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
                          <X className="text-sidebar-foreground/70" />
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

          <div className="flex flex-col gap-2 px-2 text-sm">
            {workspaces.map((ws) => (
              <div key={ws._id}>
                <div className="flex items-center gap-2">
                  <span>{ws.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {ws.members.length} members
                  </span>
                </div>
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
    </>
  );
}
