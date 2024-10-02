import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="font-semibold text-sm">Kyle Andre Lim</p>
            <p className="text-muted-foreground text-xs">Superadmin</p>
          </div>
          <ChevronDownIcon className="ml-8" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
