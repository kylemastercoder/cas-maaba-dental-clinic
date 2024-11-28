
import { getAllLogs, getAllLogsByUser } from "@/actions/logs";
import { useQuery } from "@tanstack/react-query";

export function useGetLogs() {
  return useQuery({
    queryFn: async () => getAllLogs(),
    queryKey: ["logs"],
  });
}

export function useGetLogsByUser() {
  return useQuery({
    queryFn: async () => getAllLogsByUser(),
    queryKey: ["logs"],
  });
}
