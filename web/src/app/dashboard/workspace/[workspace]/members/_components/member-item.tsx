import React, { type JSX } from "react";

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
import { Calendar, Mail, MoreHorizontal } from "lucide-react";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  member: Workspace["members"][number];
}>;

const getRoleColor = (role: Props["member"]["role"]) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800 bg-purple-800 dark:bg-purple-950/50 dark:text-purple-500 hover:bg-purple-500";
    case "admin":
      return "bg-blue-100 text-blue-800 bg-blue-800 dark:bg-blue-950/50 dark:text-blue-500 hover:bg-blue-500";
    case "member":
      return "bg-green-100 text-green-800 bg-green-800 dark:bg-green-950/50 dark:text-green-500 hover:bg-green-500";
    default:
      return "bg-gray-100 text-gray-800 bg-gray-800 dark:bg-gray-950/50 dark:text-gray-500 hover:bg-gray-500";
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

export default function MemberItem({ member }: Props): JSX.Element {
  return (
    <div
      key={member._id}
      className="flex items-center justify-between rounded-lg border p-4 transition-colors"
    >
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
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
