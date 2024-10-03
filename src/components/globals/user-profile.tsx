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
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/user";

const UserProfile = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/sign-in")
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-muted-foreground text-xs">{user?.username}</p>
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
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
