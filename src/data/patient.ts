import { getAllPatients } from "@/actions/patient";
import { useQuery } from "@tanstack/react-query";

export function useGetPatients() {
  return useQuery({
    queryFn: async () => getAllPatients(),
    queryKey: ["patients"],
  });
}
