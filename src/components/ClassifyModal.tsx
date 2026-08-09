import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Loader2, Target, Square } from 'lucide-react';
import {
  useClassificationStatus,
  useRequestClassification,
  useStopClassification,
} from '@/hooks/api/useClassification';

interface ClassifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string | null;
  source: string;
  filename: string | null;
}

export function ClassifyModal({ isOpen, onClose, batchId, source, filename }: ClassifyModalProps) {
  const { data: status, isLoading } = useClassificationStatus(batchId, isOpen);
  const request = useRequestClassification();
  const stop = useStopClassification();

  const running = !!status?.classify_requested && (status?.pending ?? 0) > 0;
  const pct =
    status && status.with_website > 0
      ? Math.round((status.classified / status.with_website) * 100)
      : 0;

  const industries = status
    ? Object.entries(status.by_industry).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div
              className="w-full max-w-lg backdrop-blur-xl bg-[#0A1628]/95 border border-[#00D9FF]/30 rounded-2xl shadow-2xl shadow-[#00D9FF]/20 flex flex-col"
              style={{ maxHeight: '85vh' }}
            >
              <div className="p-6 border-b border-[#00D9FF]/20 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl text-white flex items-center gap-2">
                    <Target className="size-5 text-[#00D9FF]" />
                    Classify industry (ICP)
                  </h2>
                  {filename && (
                    <p className="text-xs text-white/50 mt-1 truncate max-w-[24rem]">
                      {source} · {filename}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-[#00D9FF]/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <X className="size-5" />
                </motion.button>
              </div>

              {isLoading || !status ? (
                <div className="p-6 text-sm text-white/60">Loading…</div>
              ) : (
                <>
                  {/* Progress — pinned */}
                  <div className="p-6 pb-3 space-y-2 shrink-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">
                          {running ? (
                            <span className="inline-flex items-center gap-1.5 text-[#00D9FF]">
                              <Loader2 className="size-3.5 animate-spin" /> classifying…
                            </span>
                          ) : status.pending === 0 && status.classified > 0 ? (
                            <span className="text-green-400">complete</span>
                          ) : (
                            <span className="text-white/50">idle</span>
                          )}
                        </span>
                        <span className="text-white/80">
                          {status.classified.toLocaleString()} / {status.with_website.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#0A1628]/80 border border-[#00D9FF]/15 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#00D9FF] to-[#0099CC]"
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <div className="text-xs text-white/50">
                        {status.pending.toLocaleString()} pending ·{' '}
                        <span className="text-[#00D9FF]">
                          {status.icp_accepted.toLocaleString()}
                        </span>{' '}
                        paid-ads agencies found
                      </div>
                    </div>
                  </div>

                  {/* Industry breakdown — the only scrolling region */}
                  <div
                    className="px-6 space-y-1.5"
                    style={{ overflowY: 'auto', minHeight: 0, flex: '1 1 auto' }}
                  >
                    <div className="text-xs text-white/40 uppercase tracking-wider">
                      By industry ({industries.length})
                    </div>
                    {industries.map(([name, count]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between text-sm py-1 px-2 rounded-lg bg-[#0A1628]/50"
                      >
                        <span className={name === 'Paid Advertising Agency' ? 'text-[#00D9FF]' : 'text-white/70'}>
                          {name}
                        </span>
                        <span className="text-white/50">{count.toLocaleString()}</span>
                      </div>
                    ))}
                    {industries.length === 0 && (
                      <div className="text-sm text-white/40 py-2">No results yet…</div>
                    )}
                  </div>

                  {/* Controls — pinned footer */}
                  <div className="p-6 pt-3 space-y-3 shrink-0 border-t border-[#00D9FF]/15">
                    {(request.isError || stop.isError) && (
                      <p className="text-sm text-red-400">Action failed — is the backend reachable?</p>
                    )}
                    <div className="flex gap-3">
                      {running ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => batchId && stop.mutate(batchId)}
                          disabled={stop.isPending}
                          className="flex-1 px-4 py-2.5 border border-red-500/40 text-red-300 rounded-lg text-sm hover:bg-red-500/10 disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                          <Square className="size-4" />
                          {stop.isPending ? 'Stopping…' : 'Stop'}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={status.pending > 0 ? { scale: 1.02 } : undefined}
                          whileTap={status.pending > 0 ? { scale: 0.98 } : undefined}
                          onClick={() => batchId && request.mutate(batchId)}
                          disabled={status.pending <= 0 || request.isPending}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00D9FF] via-[#00B8D4] to-[#0099CC] text-[#0A1628] rounded-lg shadow-lg shadow-[#00D9FF]/40 disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                        >
                          <Sparkles className="size-4" />
                          {request.isPending
                            ? 'Starting…'
                            : status.pending > 0
                              ? `Classify ${status.pending.toLocaleString()} leads`
                              : 'All classified'}
                        </motion.button>
                      )}
                      <button
                        onClick={onClose}
                        className="px-4 py-2.5 border border-white/20 text-white/70 rounded-lg text-sm hover:bg-white/5 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                    <p className="text-xs text-white/40">
                      Runs in the background — you can close this and come back; progress keeps going.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
