import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseAddress(address: string) {
  const addressParts = address.split(",").map((part) => part.trim());

  // Fill missing parts with empty strings
  while (addressParts.length < 4) {
    addressParts.unshift(""); // Add empty string to the start until we have 4 parts
  }

  const [barangay, municipality, province, region] = addressParts.slice(-4);
  const houseNumber = addressParts.slice(0, -4).join(" ");

  return {
    houseNumber,
    region,
    province,
    municipality,
    barangay,
  };
}
