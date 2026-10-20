import React from 'react';
import { UploadCloud, SlidersHorizontal, CheckCircle2, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Import Any Image',
      desc: 'Drag & drop single or batch images in JPG, PNG, WebP, AVIF, or GIF. Files stay 100% on your local machine and never leave your browser sandbox.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Adjust, Compress or Transform',
      desc: 'Slide the visual quality slider, choose dimension presets, remove backgrounds, or crop to biometric passport specs with live split comparison.',
      icon: SlidersHorizontal,
    },
    {
      num: '03',
      title: 'Export in High Fidelity',
      desc: 'Instant 1-click download with optimized file sizes, clean stripped EXIF privacy headers, or multi-photo 4x6" printable sheets ready for printing.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-1">
            Engineered For Speed & Privacy
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How OptiPixel Works
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Powered by modern WebAssembly, Canvas API, and client-side quantization algorithms without cloud servers or subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client-Side Processing</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
