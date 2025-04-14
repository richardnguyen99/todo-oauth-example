import React, { type JSX } from "react";
import { CalendarDays, Mail, Edit, LogOut } from "lucide-react";
import clsx from "clsx";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/stores/user-store";

type Props = {
  user: User;
};

export default function AuthenticatedCard({ user }: Props): JSX.Element {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="mx-auto w-full md:w-md">
      <CardHeader className="flex flex-col items-center space-y-3 pt-6">
        <div className="relative">
          <Avatar className="border-background h-24 w-24 border-4">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-xl">
              {getInitials(user.username || "")}
            </AvatarFallback>
          </Avatar>
          <span
            className={clsx(
              "ring-background absolute right-1 bottom-1 h-4 w-4 rounded-full ring-2",
              {
                "bg-green-500": user?.verified,
                "bg-gray-400": !user?.verified,
              },
            )}
            title={`${user.verified ? "Verified" : "Not verified"}`}
          />
        </div>

        <div className="w-full space-y-1 text-center">
          <h2 className="line-clamp-1 text-2xl font-bold">{user.username}</h2>
          <Badge variant="secondary" className="font-normal">
            {user.id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>
            Joined{" "}
            {user.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </span>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="mb-2 text-sm font-medium">Account Actions</h3>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Update username
            </Button>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`}
              className={clsx(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "text-destructive hover:text-destructive justify-start",
                }),
              )}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </a>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-muted-foreground text-xs">
          Last updated:{" "}
          {new Date(user.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
