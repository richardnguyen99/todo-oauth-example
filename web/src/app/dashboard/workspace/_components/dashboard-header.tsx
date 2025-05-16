import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideReact from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = Readonly<{
  avatarUrl: string;
  avatarName: string;
  avatarAlt: string;
}>;

export default function DashboardHeader({
  avatarUrl,
  avatarName,
  avatarAlt,
}: Props): JSX.Element {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 max-w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <LucideReact.CheckCircle className="text-primary h-6 w-6" />
            <span>TaskMaster</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-64 md:flex">
            <LucideReact.Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input placeholder="Search tasks..." className="h-9 pl-8" />
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <LucideReact.Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatarUrl} alt={avatarAlt} />
                  <AvatarFallback>{avatarName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LucideReact.User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideReact.Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
