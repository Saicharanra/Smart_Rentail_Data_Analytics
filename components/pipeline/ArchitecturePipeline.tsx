'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Database,
  Workflow,
  FolderKanban,
  Cpu,
  Layers,
  ShieldCheck,
  Award,
  Server,
  BarChart3,
  ArrowRight,
  Info,
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';
import { MOCK_PIPELINE_STAGES, PipelineStage } from '@/lib/mock-data';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-teal-300" />,
  Database: <Database className="w-6 h-6 text-teal-400" />,
  Workflow: <Workflow className="w-6 h-6 text-teal-200" />,
  FolderKanban: <FolderKanban className="w-6 h-6 text-teal-300" />,
  Cpu: <Cpu className="w-6 h-6 text-teal-400" />,
  Layers: <Layers className="w-6 h-6 text-amber-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-slate-200" />,
  Award: <Award className="w-6 h-6 text-yellow-400" />,
  Server: <Server className="w-6 h-6 text-teal-300" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-teal-200" />,
};

export function ArchitecturePipeline() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(
    MOCK_PIPELINE_STAGES[4] // Default selected: Databricks
  );

  return (
    <div className="w-full bg-navy-900/90 border border-teal-500/30 rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-teal-500/20 mb-8">
        <div>
          <div className="flex items-center gap-2 ui-caption text-[14px] font-medium uppercase tracking-wider text-teal-300 mb-2">
            <Zap className="w-4 h-4 text-teal-400" /> Planned Azure Cloud Architecture
          </div>
          <h2 className="ui-h2 text-[24px] font-semibold text-white tracking-tight">
            End-to-End Data Engineering Pipeline
          </h2>
          <p className="ui-body text-[16px] text-slate-200 mt-1">
            Visual representation of data flow from transactional origin to Medallion ETL & Power BI intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-navy-950/80 px-4 py-2.5 rounded-xl border border-teal-500/30 text-xs text-slate-200">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          Pipeline Target Latency: <span className="font-semibold text-white font-mono">&lt; 5 mins</span>
        </div>
      </div>

      {/* Pipeline Diagram Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 relative">
        {MOCK_PIPELINE_STAGES.map((stage, idx) => {
          const isSelected = selectedStage?.id === stage.id;

          return (
            <motion.div
              key={stage.id}
              whileHover={{ scale: 1.02, translateY: -2 }}
              onClick={() => setSelectedStage(stage)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative ${
                isSelected
                  ? 'bg-navy-800 border-teal-400 shadow-lg shadow-teal-500/20 ring-1 ring-teal-400'
                  : 'bg-navy-950/60 border-teal-500/20 hover:border-teal-400/50 hover:bg-navy-800/60'
              }`}
            >
              {/* Connector Arrow for non-last nodes */}
              {idx < MOCK_PIPELINE_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}

              {/* Node Layer Pill */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`ui-caption text-[12px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                    stage.medallionTier === 'Bronze'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : stage.medallionTier === 'Silver'
                      ? 'bg-slate-800 text-slate-200 border-slate-600'
                      : stage.medallionTier === 'Gold'
                      ? 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40'
                      : 'bg-teal-950/60 text-teal-300 border-teal-500/40'
                  }`}
                >
                  {stage.medallionTier ? `${stage.medallionTier} Layer` : stage.layer}
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
                </span>
              </div>

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-navy-900 border border-teal-500/30">
                  {ICON_MAP[stage.iconName] || <Activity className="w-6 h-6 text-teal-300" />}
                </div>
                <h3 className="ui-h3 text-[18px] font-medium text-white line-clamp-1">
                  {stage.name}
                </h3>
              </div>

              <p className="ui-caption text-[14px] text-slate-300 line-clamp-2 mb-3">
                {stage.tech}
              </p>

              <div className="ui-caption text-[13px] text-slate-400 flex items-center justify-between border-t border-teal-500/20 pt-2 font-mono">
                <span>{stage.throughput}</span>
                <span className="text-teal-300 font-bold">{stage.latency}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Node Detailed Drawer / Inspector Card */}
      <AnimatePresence mode="wait">
        {selectedStage && (
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-navy-950/90 border border-teal-500/40 rounded-2xl p-6 lg:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-teal-500/20">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/40">
                  {ICON_MAP[selectedStage.iconName]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="ui-h3 text-[20px] font-medium text-white">{selectedStage.name}</h3>
                    <span className="ui-caption text-[13px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                      {selectedStage.tech}
                    </span>
                  </div>
                  <p className="ui-body text-[16px] text-slate-200 mt-0.5">{selectedStage.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 ui-caption text-[14px] text-slate-200 bg-navy-900 px-4 py-3 rounded-xl border border-teal-500/30">
                <div>
                  <span className="text-slate-400 block ui-caption text-[13px]">Processing Velocity</span>
                  <span className="font-semibold text-white font-mono">{selectedStage.throughput}</span>
                </div>
                <div className="h-6 w-px bg-teal-500/30" />
                <div>
                  <span className="text-slate-400 block ui-caption text-[13px]">Avg Response Latency</span>
                  <span className="font-semibold text-teal-300 font-mono">{selectedStage.latency}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedStage.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-navy-900/80 p-4 rounded-xl border border-teal-500/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="ui-body text-[16px] text-slate-200">{detail}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
