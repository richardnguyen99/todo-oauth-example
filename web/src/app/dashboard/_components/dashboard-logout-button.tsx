"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const DashboardLogoutButton = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, ...props }, ref) => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await api.get("/auth/logout");

      return response;
    },
  });

  const handleLogout = React.useCallback(() => {
    mutate();
    router.push("/login");
  }, [mutate, router]);

  return (
    <DropdownMenuItem
      ref={ref}
      className={cn("", className)}
      {...props}
      onClick={handleLogout}
    >
      <LogOut className="mr-1 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
});
DashboardLogoutButton.displayName = "DashboardLogoutButton";

export default DashboardLogoutButton;
