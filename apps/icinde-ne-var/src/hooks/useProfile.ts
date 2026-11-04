import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, createProfile, updateProfile } from "@/services/profile";
import type { Database } from "@/lib/database.types";

type ProfileUpdate = Omit<Database["public"]["Tables"]["profiller"]["Update"], "id" | "user_id">;

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.user_id], data);
    },
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => {
      if (!userId) {
        return Promise.reject(new Error("userId is required for profile update"));
      }
      return updateProfile(userId, updates);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", userId], data);
    },
  });
}
