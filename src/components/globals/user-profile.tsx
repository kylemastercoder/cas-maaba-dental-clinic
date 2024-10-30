import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/user";
import { UserCircleIcon } from "lucide-react";

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
          <UserCircleIcon className="md:hidden block" />
          <div className="md:flex hidden flex-col items-start">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-muted-foreground text-xs">{user?.username}</p>
          </div>
          <ChevronDownIcon className="md:ml-8 ml-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
