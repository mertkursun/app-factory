import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnalysisById, analyzeProduct } from "@/services/analysis";
import type { AnalyzeRequest } from "@/services/analysis";

export function useAnalysis(id: string | undefined) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => getAnalysisById(id!),
    enabled: !!id,
  });
}

export function useAnalyzeProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AnalyzeRequest) => analyzeProduct(request),
    onSuccess: (data) => {
      queryClient.setQueryData(["analysis", data.analysis.id], data.analysis);
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
