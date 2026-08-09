import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassificationService } from '@/client';

// Live classification progress for a list. Polls while `enabled` (the modal is
// open) so the panel updates as the worker drains the list.
export function useClassificationStatus(batchId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['classification-status', batchId],
    queryFn: () => ClassificationService.classificationStatus(batchId as string),
    enabled: enabled && !!batchId,
    refetchInterval: enabled ? 4000 : false,
    staleTime: 0,
  });
}

export function useRequestClassification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (batchId: string) => ClassificationService.requestClassification({ batch_id: batchId }),
    onSuccess: (_d, batchId) =>
      qc.invalidateQueries({ queryKey: ['classification-status', batchId] }),
  });
}

export function useStopClassification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (batchId: string) => ClassificationService.stopClassification({ batch_id: batchId }),
    onSuccess: (_d, batchId) =>
      qc.invalidateQueries({ queryKey: ['classification-status', batchId] }),
  });
}
