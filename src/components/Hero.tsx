import React, { useRef, useState } from 'react';
import { Upload, ShieldCheck, Zap, Image as ImageIcon, Sparkles, SlidersHorizontal, Scissors, RefreshCw } from 'lucide-react';
import { SAMPLE_ASSETS } from '../data/presets';
import { ToolId } from '../types';

interface HeroProps {
  onFilesSelected: (files: FileList | File[], initialTool?: ToolId) => void;
  onLoadSample: (sampleUrl: string, sampleName: string, initialTool?: ToolId) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFilesSelected, onLoadSample }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Subtle modern background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-sky-400/20 to-violet-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Anti-slop badge: clean unboxed metadata with bullet */}
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browser-Native Image Suite</span>
          <span aria-hidden="true" className="text-indigo-300 dark:text-indigo-700">·</span>
          <span>Zero Server Uploads</span>
        </div>

        {/* Main H1 Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Your All-in-One <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">Image Toolkit</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compress, resize, convert, edit, and create perfect images in seconds.
        </p>

        {/* Upload Zone Card */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group relative rounded-2xl border-2 border-dashed p-8 sm:p-12 transition-all duration-200 text-center ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm hover:shadow-md'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFilesSelected(e.target.files);
                }
              }}
            />

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Drag & Drop your images here, or <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">browse files</span>
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Supports JPG, PNG, WebP, AVIF, BMP, GIF up to 50MB · Batch upload supported
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Private & In-Browser
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Processing
              </span>
            </div>
          </div>

          {/* Quick Sample Test Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
              <span>Or test instantly with verified sample photos:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_ASSETS.portrait, 'sample_portrait.jpg', 'passport')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:shadow-sm"
              >
                <img
                  src={SAMPLE_ASSETS.portrait}
                  alt="Portrait sample"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">Portrait</div>
                  <div className="text-[10px] text-slate-400">Passport / ID</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_ASSETS.product, 'sample_product.jpg', 'background')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:shadow-sm"
              >
                <img
                  src={SAMPLE_ASSETS.product}
                  alt="Product sample"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">Product</div>
                  <div className="text-[10px] text-slate-400">Background Edit</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_ASSETS.landscape, 'sample_landscape.jpg', 'compress')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:shadow-sm"
              >
                <img
                  src={SAMPLE_ASSETS.landscape}
                  alt="Landscape sample"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">Landscape</div>
                  <div className="text-[10px] text-slate-400">Compress / Resize</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onLoadSample(SAMPLE_ASSETS.banner, 'sample_banner.jpg', 'editor')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:shadow-sm"
              >
                <img
                  src={SAMPLE_ASSETS.banner}
                  alt="Banner sample"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">Studio Scene</div>
                  <div className="text-[10px] text-slate-400">Editor / Filters</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
