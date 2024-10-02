import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { IconBell } from "@tabler/icons-react";

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <IconBell size={30} />
          <p className="absolute -top-1 -right-1 text-xs flex items-center justify-center text-white w-5 h-5 rounded-full bg-red-600">
            3
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex items-center justify-between">
            <p className="font-semibold">Notification</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
