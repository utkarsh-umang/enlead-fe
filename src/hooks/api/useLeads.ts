import { useQuery } from '@tanstack/react-query';
import { LeadsService } from '@/client';

export interface LeadFilters {
  source?: string;
  hasEmail?: boolean;
  finderTried?: boolean;
  /** true = an email the finder earned, false = one that came with the CSV. */
  emailFromFinder?: boolean;
  /** prospect | public_figure | host_or_regular (podscan lead-quality tag). */
  leadTag?: string;
}

export function useLeads(page: number, pageSize: number, search: string, filters: LeadFilters = {}) {
  return useQuery({
    queryKey: [
      'leads',
      page,
      pageSize,
      search,
      filters.source,
      filters.hasEmail,
      filters.finderTried,
      filters.emailFromFinder,
      filters.leadTag,
    ],
    queryFn: () =>
      LeadsService.listLeads(
        page,
        pageSize,
        search || undefined,
        filters.source,
        filters.hasEmail,
        filters.finderTried,
        filters.emailFromFinder,
        filters.leadTag
      ),
  });
}
