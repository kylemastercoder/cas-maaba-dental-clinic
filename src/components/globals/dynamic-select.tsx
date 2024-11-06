"use client";

import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const DynamicSelect = ({
  value = "",
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const { theme } = useTheme();

  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value) || null;
  }, [options, value]);

  const handleCreate = (inputValue: string) => {
    if (onCreate) {
      onCreate(inputValue);
    }
  };

  return (
    <div className="flex items-start gap-2">
      <CreatableSelect
        isMulti={false}
        placeholder={placeholder}
        className="text-sm bg-white w-full"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: isFocused
              ? theme === "dark"
                ? "#333"
                : "#ed8712" // Border color when focused
              : theme === "dark"
              ? "#111"
              : "#e2e8f0",
            backgroundColor: theme === "dark" ? "#111" : "#fff",
            boxShadow: isFocused ? "0 0 0 1px #ed8712" : "none", // Add shadow on focus
            ":hover": {
              borderColor: theme === "dark" ? "#333" : "#ed8712",
            },
          }),
        }}
        value={formattedValue}
        onChange={onSelect}
        options={options}
        onCreateOption={handleCreate}
        isDisabled={disabled}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)} // Set focus state to false
      />
    </div>
  );
};