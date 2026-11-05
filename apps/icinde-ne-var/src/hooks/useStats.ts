import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/services/stats";

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => getUserStats(userId!),
    enabled: !!userId,
    staleTime: 60_000,
  });
}
