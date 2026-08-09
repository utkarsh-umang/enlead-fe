import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessagesService } from '@/client';
import type { GenerateMessagesIn } from '@/client';

// The registered generation methods — powers the method picker. Static enough
// to cache generously; the registry only changes on a deploy.
export function useMessageMethods() {
  return useQuery({
    queryKey: ['message-methods'],
    queryFn: () => MessagesService.listMessageMethods(),
    staleTime: 5 * 60_000,
  });
}

// Dry run for the chosen source + list + method: how many lines it would write
// and a few real samples. Re-runs whenever the method changes.
export function useMessagePreview(body: GenerateMessagesIn, enabled: boolean) {
  return useQuery({
    queryKey: ['message-preview', body.source, body.batch_id, body.method],
    queryFn: () => MessagesService.previewMessages(body),
    enabled,
    staleTime: 0,
  });
}

export function useGenerateMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: GenerateMessagesIn) => MessagesService.generateMessages(body),
    onSuccess: () => {
      // email_to_send now set on those leads; the source view and any lead
      // listing reflect it.
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });
}
