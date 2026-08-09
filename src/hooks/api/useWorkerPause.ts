import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SystemService } from '@/client';

// Global pause switch for BOTH background workers (email finder + ICP
// classifier). One flag, so the user can idle everything before closing the
// laptop lid — a crawl that fires while the machine sleeps just fails.
export function useWorkerPauseState() {
  return useQuery({
    queryKey: ['worker-pause-state'],
    queryFn: () => SystemService.getWorkerPauseState(),
    refetchInterval: 10_000,
  });
}

export function usePauseWorkers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) =>
      SystemService.pauseWorkers({ reason: reason ?? null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['worker-pause-state'] }),
  });
}

export function useResumeWorkers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => SystemService.resumeWorkers(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['worker-pause-state'] }),
  });
}
