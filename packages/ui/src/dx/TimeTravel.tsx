import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Rewind, FastForward, Play } from 'lucide-react';
import type { Signal } from '@koda/signals';

interface TimeTravelProps {
    signal: Signal<any>;
    label: string;
}

export const TimeTravel: React.FC<TimeTravelProps> = ({ signal, label }) => {
    const [history, setHistory] = useState(signal.history);
    const [index, setIndex] = useState(history.length - 1);

    useEffect(() => {
        const sub = signal.subscribe(() => {
            setHistory([...signal.history]);
            setIndex(signal.history.length - 1);
        });
        return sub;
    }, [signal]);

    const scrub = (newIndex: number) => {
        if (newIndex < 0 || newIndex >= history.length) return;
        setIndex(newIndex);
        // Step into the past (Internal update without triggering new history entry?)
        // For simplicity in this DX component, we just view.
    };

    return (
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-4 font-sans text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">{label} History</span>
                </div>
                <div className="text-[10px] text-white/40">{history.length} snapshots</div>
            </div>

            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    style={{ width: `${((index + 1) / history.length) * 100}%` }}
                />
            </div>

            <div className="flex items-center justify-center gap-6">
                <button onClick={() => scrub(index - 1)} className="text-white/40 hover:text-white transition-colors">
                    <Rewind size={20} />
                </button>
                <div className="text-lg font-mono font-bold text-blue-400">
                    {index + 1}
                </div>
                <button onClick={() => scrub(index + 1)} className="text-white/40 hover:text-white transition-colors">
                    <FastForward size={20} />
                </button>
            </div>

            <div className="p-3 bg-white/5 rounded-lg border border-white/5 font-mono text-[10px] text-blue-100/60 overflow-x-auto">
                <pre>{JSON.stringify(history[index]?.value, null, 2)}</pre>
            </div>
        </div>
    );
};
