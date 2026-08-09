import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquareText, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useMessageMethods,
  useMessagePreview,
  useGenerateMessages,
} from '@/hooks/api/useEmailGeneration';

interface GenerateOpeningLinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  batchId: string | null;
  filename: string | null;
}

export function GenerateOpeningLinesModal({
  isOpen,
  onClose,
  source,
  batchId,
  filename,
}: GenerateOpeningLinesModalProps) {
  const [method, setMethod] = useState('');

  const { data: methods, isLoading: methodsLoading } = useMessageMethods();
  const generate = useGenerateMessages();

  const body = { source, batch_id: batchId ?? '', method };
  const previewEnabled = isOpen && !!batchId && !!method;
  const { data: preview, isLoading: previewLoading } = useMessagePreview(body, previewEnabled);

  // Default to the first method once the registry loads.
  useEffect(() => {
    if (!method && methods && methods.length > 0) setMethod(methods[0].name);
  }, [methods, method]);

  // Fresh mutation state each time the modal opens.
  useEffect(() => {
    if (isOpen) generate.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const selectedMethod = methods?.find((m) => m.name === method);

  const handleGenerate = () => {
    if (!batchId || !method) return;
    generate.mutate({ source, batch_id: batchId, method });
  };

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
            <div className="w-full max-w-lg backdrop-blur-xl bg-[#0A1628]/95 border border-[#00D9FF]/30 rounded-2xl shadow-2xl shadow-[#00D9FF]/20">
              <div className="p-6 border-b border-[#00D9FF]/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-white flex items-center gap-2">
                    <MessageSquareText className="size-5 text-[#00D9FF]" />
                    Generate opening lines
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

              {/* Success state */}
              {generate.isSuccess ? (
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 shrink-0 text-green-400" />
                    <div className="text-sm text-white/80">
                      Wrote{' '}
                      <span className="text-[#00D9FF]">
                        {generate.data.generated.toLocaleString()}
                      </span>{' '}
                      opening lines to this list.
                      {generate.data.skipped > 0 && (
                        <span className="text-white/50">
                          {' '}
                          {generate.data.skipped.toLocaleString()} skipped (no name to use).
                        </span>
                      )}
                      <div className="text-white/50 mt-2">
                        They're stored on each lead and go out in the{' '}
                        <span className="text-white/70">email_to_send</span> column on the next
                        export.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-[#00D9FF] via-[#00B8D4] to-[#0099CC] text-[#0A1628] rounded-lg shadow-lg shadow-[#00D9FF]/40 text-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  {/* Method picker */}
                  <div>
                    <label className="block text-xs text-white/60 uppercase tracking-wider mb-2">
                      Method
                    </label>
                    {methodsLoading || !methods ? (
                      <div className="text-sm text-white/60">Loading methods…</div>
                    ) : (
                      <>
                        <select
                          value={method}
                          onChange={(e) => setMethod(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#0A1628]/60 border border-[#00D9FF]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#00D9FF]"
                        >
                          {methods.map((m) => (
                            <option key={m.name} value={m.name}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        {selectedMethod && (
                          <p className="text-xs text-white/40 mt-2">{selectedMethod.description}</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Preview */}
                  {previewEnabled && (previewLoading || !preview) ? (
                    <div className="text-sm text-white/60">Previewing…</div>
                  ) : preview ? (
                    <div className="space-y-3">
                      <div className="text-sm text-white/80">
                        {preview.total_leads.toLocaleString()} leads in this list ·{' '}
                        <span className="text-[#00D9FF]">
                          {preview.would_generate.toLocaleString()}
                        </span>{' '}
                        will get a line
                        {preview.would_skip > 0 && (
                          <span className="text-white/50">
                            {' '}
                            · {preview.would_skip.toLocaleString()} skipped
                          </span>
                        )}
                      </div>

                      {preview.samples.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-white/40 uppercase tracking-wider">
                            Sample output
                          </div>
                          {preview.samples.map((s) => (
                            <div
                              key={s.lead_id}
                              className="p-3 bg-[#0A1628]/60 border border-[#00D9FF]/20 rounded-lg"
                            >
                              <div className="text-xs text-white/50 truncate">{s.display_name}</div>
                              <div className="text-sm text-white/80 mt-0.5">{s.email_to_send}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {generate.isError && (
                    <p className="text-sm text-red-400">
                      Generation failed — is the backend reachable?
                    </p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <motion.button
                      whileHover={preview && preview.would_generate > 0 ? { scale: 1.02 } : undefined}
                      whileTap={preview && preview.would_generate > 0 ? { scale: 0.98 } : undefined}
                      onClick={handleGenerate}
                      disabled={!preview || preview.would_generate <= 0 || generate.isPending}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00D9FF] via-[#00B8D4] to-[#0099CC] text-[#0A1628] rounded-lg shadow-lg shadow-[#00D9FF]/40 disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="size-4" />
                      {generate.isPending
                        ? 'Generating…'
                        : preview
                          ? `Generate ${preview.would_generate.toLocaleString()} lines`
                          : 'Generate'}
                    </motion.button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 border border-white/20 text-white/70 rounded-lg text-sm hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
