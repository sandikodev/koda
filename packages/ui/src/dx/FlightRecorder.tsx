import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Shield, Terminal, ChevronRight, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FlightTrace {
    requestId: string;
    startTime: number;
    metadata: Record<string, any>;
}

export const FlightRecorder: React.FC = () => {
    const [history, setHistory] = useState<FlightTrace[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/framework/dx/flight/history');
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error('Flight Recorder Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 3000); // Polling for "real-time"
        return () => clearInterval(interval);
    }, []);

    const selectedTrace = history.find(t => t.requestId === selectedId);

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold tracking-tight">ZENITH FLIGHT RECORDER</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Real-time Forensic Diagnostics</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                        LIVE
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Request List */}
                <div className="w-1/3 border-r border-white/5 overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="p-8 text-center text-white/40 text-xs">Synchronizing Pulse...</div>
                    )}
                    {!loading && history.length === 0 && (
                        <div className="p-8 text-center text-white/40 text-xs">No active signals detected.</div>
                    )}
                    {history.map((trace) => (
                        <button
                            key={trace.requestId}
                            onClick={() => setSelectedId(trace.requestId)}
                            className={cn(
                                "w-full px-4 py-3 flex flex-col gap-1 text-left transition-all border-b border-white/5 hover:bg-white/5",
                                selectedId === trace.requestId && "bg-blue-500/10 border-l-2 border-l-blue-500"
                            )}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-white/60 truncate max-w-[120px]">
                                    {trace.requestId}
                                </span>
                                <span className="text-[9px] text-white/30">
                                    {new Date(trace.startTime).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-white/90">Request Received</span>
                                {trace.metadata.error && <AlertCircle size={12} className="text-red-400" />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Details View */}
                <div className="flex-1 bg-black/20 overflow-y-auto p-6 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {selectedTrace ? (
                            <motion.div
                                key={selectedTrace.requestId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                                            <Clock size={12} /> Start Time
                                        </div>
                                        <div className="text-sm font-mono">{selectedTrace.startTime}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                                            <Shield size={12} /> Security Mode
                                        </div>
                                        <div className="text-sm font-medium text-emerald-400">Fortress Zenith</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal size={14} /> Black Box Telemetry
                                    </h3>
                                    <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-blue-200/80">
                                        <pre>{JSON.stringify(selectedTrace, null, 2)}</pre>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Async Execution Chain</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                            <ChevronRight size={14} className="text-white/20" />
                                            <span className="text-xs">Middleware Engine Initialized</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                            <ChevronRight size={14} className="text-white/20" />
                                            <span className="text-xs">Institutional DI Container Loaded</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-6 bg-white/5 rounded-full text-white/20">
                                    <Activity size={48} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white/80">Select a signal to analyze</h3>
                                    <p className="text-xs text-white/40">Real-time forensic data will appear here.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
        </div>
    );
};
