import React, { type JSX } from "react";
import {
  AlignLeft,
  ArrowUpDown,
  Check,
  History,
  MoreHorizontal,
  Rows2,
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

export default function SidebarMoreWorkspaceSheet(): JSX.Element {
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
            <SidebarMenuButton className="text-sidebar-foreground/70" asChild>
              <div>
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>more</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SheetTrigger>

        <SheetContent
          className="md:h-[calc(100%-112px)] [&>button:last-child]:hidden"
          side="left"
          container={container}
        >
          <SheetHeader>
            <SheetTitle asChild>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">More workspaces</h3>
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

                        <DropdownMenuItem>
                          <Rows2 className="mr-1 h-4 w-4" />
                          <span className="truncate text-ellipsis">
                            Number of tasks
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
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>

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
