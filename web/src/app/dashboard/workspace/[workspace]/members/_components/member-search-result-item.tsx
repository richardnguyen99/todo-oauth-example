"use client";

import React, { type JSX } from "react";

import { FetchedUser } from "@/_types/user";
import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = Readonly<{
  user: FetchedUser;
  handleSelect: (userId: string) => void;
  checked?: boolean;
}>;

export default function MemberSearchResultItem({
  user,
  handleSelect,
  checked,
}: Props): JSX.Element {
  return (
    <CommandItem
      value={user._id}
      key={user._id}
      onSelect={() => {
        handleSelect(user._id);
      }}
    >
      <Avatar>
        <AvatarImage
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
        />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-xs">
        <div className="font-medium">{user.username}</div>
        <div className="text-muted-foreground">{user.email}</div>
      </div>
      <Check className={cn("ml-auto", checked ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}
