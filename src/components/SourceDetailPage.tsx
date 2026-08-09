import { motion } from 'motion/react';
import { ArrowLeft, Upload, Layers, Mail, MailX, Menu, Home, MessageSquareText, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BatchDetailModal } from './BatchDetailModal';
import { GenerateOpeningLinesModal } from './GenerateOpeningLinesModal';
import { ClassifyModal } from './ClassifyModal';
import { useSidebar } from '../context/SidebarContext';
import { useSourceDetail } from '../hooks/api/useSourceDetail';
import { useReleaseEnrichment } from '../hooks/api/useReleaseEnrichment';
import { AnimatedCounter } from './AnimatedCounter';

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: typeof Upload;
  label: string;
  value: number;
  sub?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px rgba(0, 217, 255, 0.3)',
        borderColor: 'rgba(0, 217, 255, 0.6)',
      }}
      className="backdrop-blur-xl bg-[#0A1628]/40 border border-[#00D9FF]/30 rounded-2xl p-4 sm:p-6 shadow-lg shadow-[#00D9FF]/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-[#00D9FF]/60" />
        <div className="text-xs sm:text-sm text-white/60">{label}</div>
      </div>
      <div className="text-2xl sm:text-3xl text-[#00D9FF] bioluminescent-text">
        <AnimatedCounter value={value} delay={delay + 0.1} />
      </div>
      {sub && <div className="text-xs sm:text-sm text-white/40 mt-1">{sub}</div>}
    </motion.div>
  );
}

export function SourceDetailPage() {
  const { source } = useParams<{ source: string }>();
  const navigate = useNavigate();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [detailBatchId, setDetailBatchId] = useState<string | null>(null);
  const [genBatch, setGenBatch] = useState<{ id: string; filename: string } | null>(null);
  const [classifyBatch, setClassifyBatch] = useState<{ id: string; filename: string } | null>(null);

  const { data, isLoading, isError } = useSourceDetail(source ?? '');
  const release = useReleaseEnrichment(source ?? '');

  return (
    <div className="flex h-screen bg-[#0A1628] noise-texture">
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="lg:hidden fixed inset-y-0 left-0 z-50"
        >
          <Sidebar isCollapsed={false} onToggleCollapse={() => setIsMobileMenuOpen(false)} isMobileMenu />
        </motion.div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="backdrop-blur-xl bg-[#0A1628]/60 border-b border-[#00D9FF]/20 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-[#00D9FF]/10 rounded-lg transition-colors border border-[#00D9FF]/30"
            >
              <Menu className="size-5 text-[#00D9FF]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, x: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 border border-[#00D9FF]/30 rounded-lg text-white hover:bg-[#00D9FF]/10 transition-all text-sm"
            >
              <ArrowLeft className="size-4 text-[#00D9FF]" />
              <span className="hidden sm:inline">Dashboard</span>
            </motion.button>
            <h1 className="text-xl sm:text-2xl text-white">{source}</h1>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {isLoading && <div className="text-center text-white/60 text-sm py-8">Loading…</div>}
          {isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-lg text-red-300 text-sm">
              Couldn't load this source — it may not exist, or the backend isn't reachable.
            </div>
          )}

          {data && (
            <>
              {/* The four metrics: originally uploaded, deduped, had email
                  originally, and currently without email (== eligible for
                  the email finder to work on). */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard icon={Upload} label="Originally Uploaded" value={data.total_rows_uploaded} delay={0.1} />
                <StatCard icon={Layers} label="Deduped" value={data.total_deduped} delay={0.15} />
                <StatCard
                  icon={Mail}
                  label="Had Email at Upload"
                  value={data.total_with_email_at_upload}
                  delay={0.2}
                />
                <StatCard
                  icon={MailX}
                  label="Email Finder Queue"
                  value={data.enrichment_pending}
                  sub={`${data.enrichment_tried_no_email.toLocaleString()} tried without luck · ${(data.currently_with_email - data.total_with_email_at_upload).toLocaleString()} found by finder`}
                  delay={0.25}
                />
              </div>

              {/* Import-time hold: leads waiting for an explicit go-ahead */}
              {data.enrichment_on_hold > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 sm:mb-8 p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm text-amber-300">
                      {data.enrichment_on_hold.toLocaleString()} leads are on hold — imported
                      with "find emails automatically" turned off.
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      Releasing sends them to the email finder queue immediately (the worker
                      wakes up on its own).
                    </p>
                  </div>
                  <button
                    onClick={() => release.mutate()}
                    disabled={release.isPending}
                    className="px-4 py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-sm hover:bg-amber-500/30 disabled:opacity-50 transition-colors shrink-0"
                  >
                    {release.isPending
                      ? 'Releasing…'
                      : `Send ${data.enrichment_on_hold.toLocaleString()} to Email Finder`}
                  </button>
                </motion.div>
              )}

              {/* Upload history */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-[#0A1628]/40 border border-[#00D9FF]/30 rounded-2xl shadow-lg shadow-[#00D9FF]/10 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-[#00D9FF]/20">
                  <h2 className="text-lg sm:text-xl text-white">Upload History</h2>
                  <p className="text-xs text-white/40 mt-1">
                    Click a batch to see its full detail, including quarantined rows.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00D9FF]/20">
                        <th className="text-left p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          File
                        </th>
                        <th className="text-left p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Uploaded
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Raw
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Quarantined
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          New
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Merged
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          With Email
                        </th>
                        <th className="text-left p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Status
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Classify
                        </th>
                        <th className="text-right p-3 sm:p-4 text-xs uppercase tracking-wider text-white/60">
                          Openers
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.batches.map((batch, index) => (
                        <motion.tr
                          key={batch.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          onClick={() => setDetailBatchId(batch.id)}
                          className="border-b border-[#00D9FF]/10 hover:bg-[#00D9FF]/5 transition-colors cursor-pointer"
                        >
                          <td className="p-3 sm:p-4 text-white text-sm">{batch.filename}</td>
                          <td className="p-3 sm:p-4 text-white/60 text-sm">
                            {new Date(batch.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 sm:p-4 text-white/70 text-sm text-right">{batch.row_count_raw}</td>
                          <td className="p-3 sm:p-4 text-white/70 text-sm text-right">
                            {batch.row_count_quarantined}
                          </td>
                          <td className="p-3 sm:p-4 text-green-400 text-sm text-right">{batch.row_count_new_leads}</td>
                          <td className="p-3 sm:p-4 text-[#00D9FF] text-sm text-right">{batch.row_count_merged}</td>
                          <td className="p-3 sm:p-4 text-white/70 text-sm text-right">
                            {batch.row_count_with_email}
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/40">
                              {batch.status}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setClassifyBatch({ id: batch.id, filename: batch.filename });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/20 transition-colors"
                              title="Classify this list's companies by industry (ICP)"
                            >
                              <Target className="size-3.5" />
                              Classify
                            </motion.button>
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setGenBatch({ id: batch.id, filename: batch.filename });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/20 transition-colors"
                              title="Generate email opening lines for this list"
                            >
                              <MessageSquareText className="size-3.5" />
                              Generate
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <BatchDetailModal batchId={detailBatchId} onClose={() => setDetailBatchId(null)} />

      <GenerateOpeningLinesModal
        isOpen={genBatch !== null}
        onClose={() => setGenBatch(null)}
        source={source ?? ''}
        batchId={genBatch?.id ?? null}
        filename={genBatch?.filename ?? null}
      />

      <ClassifyModal
        isOpen={classifyBatch !== null}
        onClose={() => setClassifyBatch(null)}
        source={source ?? ''}
        batchId={classifyBatch?.id ?? null}
        filename={classifyBatch?.filename ?? null}
      />

      <style>{`
        .bioluminescent-text {
          text-shadow: 0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
