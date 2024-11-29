"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "@/components/auth/logout-button";
import { LogOut } from "lucide-react";
import { api } from "@/trpc/react";

interface UserButtonProps {
  isMobile: boolean;
}

export const UserButton = ({ isMobile }: UserButtonProps) => {
  const { data: user } = api.user.getUserByEmail.useQuery();

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "";

    const splitName = name.trim().split(/\s+/);

    // Explicitly check that splitName is not empty
    if (splitName.length === 0) return "";

    if (splitName.length === 1) {
      return splitName[0]?.[0]?.toUpperCase() ?? "UU";
    }

    return `${splitName[0]?.[0]?.toUpperCase() ?? "UU"}${splitName[1]?.[0]?.toUpperCase() ?? "UU"}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="outline-none">
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback className="text-center">
            {getInitials(user?.name ?? "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="end"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
