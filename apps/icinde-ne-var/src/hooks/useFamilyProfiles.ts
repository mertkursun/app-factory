import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFamilyProfiles,
  addFamilyProfile,
  updateFamilyProfile,
  deleteFamilyProfile,
} from "@/services/familyProfiles";
import type { Database } from "@/lib/database.types";

type FamilyProfileInsert = Database["public"]["Tables"]["aile_profilleri"]["Insert"];
type FamilyProfileUpdate = Database["public"]["Tables"]["aile_profilleri"]["Update"];

const QUERY_KEY = "familyProfiles";

export function useFamilyProfiles(userId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => getFamilyProfiles(userId!),
    enabled: !!userId,
  });
}

export function useAddFamilyProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Omit<FamilyProfileInsert, "sira">) => addFamilyProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
    },
  });
}

export function useUpdateFamilyProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Omit<FamilyProfileUpdate, "id" | "user_id">;
    }) => updateFamilyProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
    },
  });
}

export function useDeleteFamilyProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFamilyProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] });
    },
  });
}
