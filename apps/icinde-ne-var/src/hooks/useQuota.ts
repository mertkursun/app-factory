import { useQuery } from "@tanstack/react-query";
import { getQuotaInfo } from "@/services/quota";

const STALE_TIME_MS = 60_000; // 1 dakika

export function useQuota(userId: string | undefined) {
  return useQuery({
    queryKey: ["quota", userId],
    queryFn: () => getQuotaInfo(userId!),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
  });
}
