import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Trash2, AlertTriangle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { LeadOut } from '@/client';
import { useDeleteLead } from '@/hooks/api/useDeleteLead';
import { useLeadRawRows } from '@/hooks/api/useLeadRawRows';
import { useLeadEnrichment } from '@/hooks/api/useLeadEnrichment';
import { leadDisplayName } from '@/lib/leadDisplayName';

interface LeadDetailModalProps {
  lead: LeadOut | null;
  onClose: () => void;
}

function Field({ label, value, href }: { label: string; value: string | number | null; href?: boolean }) {
  if (value === null || value === '') return null;
  return (
    <div className="py-2 border-b border-[#00D9FF]/10 last:border-0">
      <div className="text-xs text-white/50 uppercase tracking-wider mb-1">{label}</div>
      {href ? (
        <a
          href={String(value)}
          target="_blank"
          rel="noreferrer"
          className="text-[#00D9FF] hover:underline text-sm flex items-center gap-1 break-all"
        >
          {value}
          <ExternalLink className="size-3 shrink-0" />
        </a>
      ) : (
        <div className="text-white text-sm break-all">{value}</div>
      )}
    </div>
  );
}

function RawSourceData({ leadId }: { leadId: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: rawRows, isLoading } = useLeadRawRows(leadId);

  if (isLoading) return <div className="text-sm text-white/40 py-2">Loading raw data…</div>;
  if (!rawRows || rawRows.length === 0) return null;

  return (
    <div className="space-y-2">
      {rawRows.map((row, i) => (
        <div key={i} className="border border-[#00D9FF]/15 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-[#00D9FF]/5 transition-colors"
          >
            {expanded === i ? (
              <ChevronDown className="size-3.5 text-[#00D9FF] shrink-0" />
            ) : (
              <ChevronRight className="size-3.5 text-white/40 shrink-0" />
            )}
            <FileText className="size-3.5 text-white/40 shrink-0" />
            <span className="text-sm text-white/80 break-all flex-1">{row.filename}</span>
            <span className="text-xs text-white/40 shrink-0">row {row.row_index + 1}</span>
          </button>
          {expanded === i && (
            <div className="px-3 pb-3">
              <div className="bg-[#0A1628]/60 rounded p-3 space-y-1">
                {Object.entries(row.raw_data).map(([key, value]) => (
                  <div key={key} className="flex gap-3 text-xs">
                    <span className="text-white/40 w-40 shrink-0 break-all">{key}</span>
                    <span className="text-white/80 break-all">
                      {value === null || value === '' ? '—' : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EnrichmentHistory({ leadId }: { leadId: string }) {
  const { data: attempts } = useLeadEnrichment(leadId);

  if (!attempts || attempts.length === 0) return null;

  return (
    <div className="py-2 border-b border-[#00D9FF]/10">
      <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
        Email finder attempts ({attempts.length})
      </div>
      <div className="space-y-1.5 mt-1">
        {attempts.map((a, i) => (
          <div key={i} className="text-sm flex items-baseline justify-between gap-2">
            <span className={a.status === 'found' ? 'text-green-400' : 'text-white/70'}>
              {a.status === 'found' ? `found ${a.value}` : a.status.replace('_', ' ')}
              <span className="text-white/40"> · {a.cost_mode} cost</span>
            </span>
            <span className="text-white/40 text-xs shrink-0">
              {new Date(a.attempted_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Appearance {
  podcast_name?: string;
  episode_title?: string;
  episode_url?: string;
  episode_published_at?: string;
}

// The podcast/episode trail for a Podscan guest — the outreach hook ("I heard
// you on X"). Lives in the raw rows' all_appearances_json (the flattener packs
// every episode a guest appeared on); we parse it across all of the lead's raw
// rows, dedupe by episode, and show newest first. Returns null for any lead
// that has no such data, so it only renders for podcast guests.
const _MAX_SHOWN = 12;

function PodcastAppearances({ leadId }: { leadId: string }) {
  const { data: rawRows } = useLeadRawRows(leadId);
  if (!rawRows) return null;

  const seen = new Set<string>();
  const appearances: Appearance[] = [];
  for (const row of rawRows) {
    const raw = row.raw_data as Record<string, unknown>;
    let list: Appearance[] = [];
    const json = raw['all_appearances_json'];
    if (typeof json === 'string' && json.trim()) {
      try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) list = parsed as Appearance[];
      } catch {
        /* not this lead's shape — ignore */
      }
    }
    // Fallback to the flat headline fields if the JSON list is absent.
    if (list.length === 0 && (raw['podcast_name'] || raw['episode_title'])) {
      list = [
        {
          podcast_name: raw['podcast_name'] as string,
          episode_title: raw['episode_title'] as string,
          episode_url: raw['episode_url'] as string,
          episode_published_at: raw['episode_published_at'] as string,
        },
      ];
    }
    for (const a of list) {
      const key = a.episode_url || `${a.podcast_name}|${a.episode_title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      appearances.push(a);
    }
  }
  if (appearances.length === 0) return null;

  appearances.sort((a, b) =>
    (b.episode_published_at || '').localeCompare(a.episode_published_at || '')
  );
  const shown = appearances.slice(0, _MAX_SHOWN);

  return (
    <>
      <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-6">
        Podcast appearances ({appearances.length})
      </h3>
      <div className="space-y-2 py-2">
        {shown.map((a, i) => (
          <div key={i} className="border-b border-[#00D9FF]/10 last:border-0 pb-2 last:pb-0">
            <div className="text-xs text-white/50 mb-0.5 break-all">{a.podcast_name || '—'}</div>
            {a.episode_url ? (
              <a
                href={a.episode_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#00D9FF] hover:underline text-sm flex items-start gap-1"
              >
                <span className="break-all">{a.episode_title || a.episode_url}</span>
                <ExternalLink className="size-3 shrink-0 mt-1" />
              </a>
            ) : (
              <div className="text-white text-sm break-all">{a.episode_title || '—'}</div>
            )}
            {a.episode_published_at && (
              <div className="text-xs text-white/40 mt-0.5">
                {new Date(a.episode_published_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>
        ))}
        {appearances.length > _MAX_SHOWN && (
          <div className="text-xs text-white/40">+{appearances.length - _MAX_SHOWN} more</div>
        )}
      </div>
    </>
  );
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteLead = useDeleteLead();

  // Reset confirm state and any stale mutation result whenever a different
  // lead opens (or the modal closes) — otherwise a leftover error/pending
  // state from a previous delete could bleed into the next lead's view.
  useEffect(() => {
    setConfirmingDelete(false);
    deleteLead.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  const handleDelete = () => {
    if (!lead) return;
    deleteLead.mutate(lead.id, { onSuccess: onClose });
  };

  // Which identity sections this lead actually has data for. A lead can in
  // principle be both (a merge across source kinds), so these aren't
  // mutually exclusive.
  const isYouTubeLead = Boolean(
    lead?.youtube_channel_name || lead?.youtube_handle || lead?.youtube_channel_id,
  );
  const isPersonLead = Boolean(lead?.first_name || lead?.last_name || lead?.company_name);

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* maxHeight is inline, not max-h-[85vh]: src/index.css is a static
                pre-generated Tailwind snapshot (no build plugin), so arbitrary
                utilities not already in it produce no CSS at all. */}
            <div
              style={{ maxHeight: '85vh' }}
              className="w-full max-w-2xl overflow-y-auto backdrop-blur-xl bg-[#0A1628]/95 border border-[#00D9FF]/30 rounded-2xl shadow-2xl shadow-[#00D9FF]/20"
            >
              <div className="sticky top-0 backdrop-blur-xl bg-[#0A1628]/95 p-6 border-b border-[#00D9FF]/20 flex items-center justify-between">
                <h2 className="text-xl text-white">{leadDisplayName(lead) || 'Lead detail'}</h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmingDelete(true)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/60 hover:text-red-400"
                    title="Delete this lead"
                  >
                    <Trash2 className="size-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-[#00D9FF]/10 rounded-lg transition-colors text-white/60 hover:text-white"
                  >
                    <X className="size-5" />
                  </motion.button>
                </div>
              </div>

              {confirmingDelete && (
                <div className="p-4 mx-6 mt-6 bg-red-500/10 border border-red-500/40 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-300">
                      Delete <span className="text-white">{leadDisplayName(lead) || 'this lead'}</span>{' '}
                      permanently? This can't be undone.
                    </p>
                    {deleteLead.isError && (
                      <p className="text-xs text-red-400 mt-2">Delete failed — is the backend reachable?</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleDelete}
                        disabled={deleteLead.isPending}
                        className="px-3 py-1.5 bg-red-500/20 border border-red-500/60 text-red-300 rounded-lg text-sm hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleteLead.isPending ? 'Deleting…' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmingDelete(false)}
                        disabled={deleteLead.isPending}
                        className="px-3 py-1.5 border border-white/20 text-white/70 rounded-lg text-sm hover:bg-white/5 disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-2">Contact</h3>
                  <Field label="Email" value={lead.email} />
                  <Field label="Email source" value={lead.email_source} />
                  <Field
                    label="Email confidence"
                    value={lead.email_confidence !== null ? `${Math.round(lead.email_confidence * 100)}%` : null}
                  />
                  <Field label="Website" value={lead.website} href />

                  <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-6">Social</h3>
                  <Field label="YouTube" value={lead.social_youtube} href />
                  <Field label="Twitter" value={lead.social_twitter} href />
                  <Field label="Instagram" value={lead.social_instagram} href />
                  <Field label="TikTok" value={lead.social_tiktok} href />
                  <Field label="Facebook" value={lead.social_facebook} href />
                  <Field label="LinkedIn" value={lead.social_linkedin} href />
                </div>

                <div>
                  {/* A lead is either YouTube-native or person-centric — showing
                      the empty section for the other kind is just noise. */}
                  {isYouTubeLead && (
                    <>
                      <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-2">
                        YouTube identity
                      </h3>
                      <Field label="Channel name" value={lead.youtube_channel_name} />
                      <Field label="Handle" value={lead.youtube_handle} />
                      <Field label="Channel ID" value={lead.youtube_channel_id} />
                      <Field label="Subscribers" value={lead.youtube_subscriber_count?.toLocaleString() ?? null} />
                      <Field label="Videos" value={lead.youtube_video_count?.toLocaleString() ?? null} />
                      <Field label="Uploads (last 30d)" value={lead.youtube_uploads_last_30d} />
                      <Field label="Avg views" value={lead.youtube_avg_views?.toLocaleString() ?? null} />
                      <Field label="Last upload" value={lead.youtube_last_upload_date} />
                    </>
                  )}

                  {isPersonLead && (
                    <>
                      <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-2">Person</h3>
                      <Field label="First name" value={lead.first_name} />
                      <Field label="Last name" value={lead.last_name} />
                      <Field label="Job title" value={lead.job_title} />
                      <Field label="Seniority" value={lead.seniority} />

                      <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-6">Company</h3>
                      <Field label="Company" value={lead.company_name} />
                      <Field label="Company LinkedIn" value={lead.company_linkedin} href />
                      <Field label="Phone" value={lead.phone} />
                    </>
                  )}

                  <PodcastAppearances leadId={lead.id} />

                  <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-6">Categorization</h3>
                  <Field
                    label="Tag"
                    value={
                      lead.lead_tag
                        ? lead.lead_tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                        : null
                    }
                  />
                  <Field label="Country" value={lead.country} />
                  <Field label="Industry" value={lead.industry} />
                  <Field label="Niche" value={lead.niche} />
                  <Field label="Category" value={lead.category} />

                  <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-2 mt-6">Provenance</h3>
                  {lead.source_files.length === 0 ? (
                    <Field label="Sources" value={lead.sources.join(', ') || null} />
                  ) : (
                    <div className="py-2 border-b border-[#00D9FF]/10">
                      <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                        Uploaded in ({lead.source_files.length})
                      </div>
                      <div className="space-y-1.5 mt-1">
                        {lead.source_files.map((sf, i) => (
                          <div key={i} className="text-sm text-white flex items-baseline justify-between gap-2">
                            <span className="break-all">{sf.filename}</span>
                            <span className="text-white/40 text-xs shrink-0">
                              {new Date(sf.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Field label="Added to master table" value={new Date(lead.created_at).toLocaleString()} />
                  <EnrichmentHistory leadId={lead.id} />
                  <Field
                    label="Last contacted (Instantly)"
                    value={
                      lead.last_contacted
                        ? new Date(lead.last_contacted).toLocaleDateString(undefined, {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Never'
                    }
                  />
                </div>
              </div>

              {/* Full-width below the two columns: the untouched original
                  CSV values from every file that contributed to this lead. */}
              <div className="px-6 pb-6">
                <h3 className="text-sm text-[#00D9FF] uppercase tracking-wider mb-3">
                  Raw source data (as uploaded)
                </h3>
                <RawSourceData leadId={lead.id} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
