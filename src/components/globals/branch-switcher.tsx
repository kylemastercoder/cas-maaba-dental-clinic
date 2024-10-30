"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Branch } from "@prisma/client";
import { useBranchModal } from "@/hooks/use-branch-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface BranchSwitcherProps extends PopoverTriggerProps {
  items: Branch[];
  className?: string;
}

const BranchSwitcher = ({
  items = [],
  className,
}: BranchSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const branchModal = useBranchModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentBranch = formattedItems.find(
    (item) => item.value === params.branchId
  );

  const onBranchSelect = (branch: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${branch.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a branch"
          className={cn(
            `justify-between w-full text-neutral-700 dark:text-neutral-200 text-sm`,
            className
          )}
        >
          <StoreIcon className="mr-2 h-5 w-5 text-neutral-700 dark:text-neutral-200" />
          {currentBranch?.label || "Select a branch"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search branch..." />
            <CommandEmpty>No branches found.</CommandEmpty>
            <CommandGroup heading="Branches">
              {formattedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onBranchSelect(item)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-5 w-5",
                      currentBranch?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  branchModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                Create Branch
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BranchSwitcher;
