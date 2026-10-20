import React, { useState, useEffect, useRef } from 'react';
import { Download, Sliders, Check, AlertCircle, RefreshCw, FileArchive, Layers, Eye } from 'lucide-react';
import { ImageFileItem } from '../../types';
import { compressCanvasToBlob, downloadFile, formatBytes, loadImageFromFile } from '../../utils/imageProcessors';

interface CompressorToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const CompressorTool: React.FC<CompressorToolProps> = ({
  files,
  onUpdateFile,
  onSelectAnother
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<string>('webp');
  const [useTargetSize, setUseTargetSize] = useState<boolean>(false);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(150);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Before / After slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isComparing, setIsComparing] = useState<boolean>(true);

  const currentFile = files.find((f) => f.id === selectedFileId) || files[0];

  // Re-run compression when settings change
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const runCompression = async () => {
      setIsProcessing(true);
      setWarningMessage(null);

      try {
        const { img } = await loadImageFromFile(currentFile.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d canvas context');
        ctx.drawImage(img, 0, 0);

        const targetBytes = useTargetSize ? targetSizeKb * 1024 : undefined;
        const result = await compressCanvasToBlob(
          canvas,
          targetFormat,
          quality / 100,
          targetBytes
        );

        if (isMounted) {
          if (result.warning) {
            setWarningMessage(result.warning);
          }
          onUpdateFile(currentFile.id, {
            processedUrl: result.url,
            processedSize: result.blob.size,
            processedWidth: canvas.width,
            processedHeight: canvas.height,
            format: targetFormat,
            status: 'done'
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setWarningMessage(err.message || 'Compression failed');
        }
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    };

    const timeout = setTimeout(runCompression, 200);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [selectedFileId, quality, targetFormat, useTargetSize, targetSizeKb, currentFile?.file]);

  const handleDownloadSingle = () => {
    if (!currentFile?.processedUrl) return;
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    downloadFile(currentFile.processedUrl, `${baseName}-compressed.${ext}`);
  };

  const handleDownloadAllBatch = async () => {
    setIsProcessing(true);
    for (const fileItem of files) {
      try {
        const { img } = await loadImageFromFile(fileItem.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const targetBytes = useTargetSize ? targetSizeKb * 1024 : undefined;
          const result = await compressCanvasToBlob(canvas, targetFormat, quality / 100, targetBytes);
          const baseName = fileItem.name.substring(0, fileItem.name.lastIndexOf('.')) || fileItem.name;
          const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
          downloadFile(result.url, `${baseName}-compressed.${ext}`);
        }
      } catch (e) {
        console.error('Batch compression item failed', e);
      }
    }
    setIsProcessing(false);
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">No images selected.</p>
        <button onClick={onSelectAnother} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Upload Image
        </button>
      </div>
    );
  }

  const originalSize = currentFile.originalSize;
  const compressedSize = currentFile.processedSize || originalSize;
  const savingsBytes = Math.max(0, originalSize - compressedSize);
  const savingsPercent = Math.round((savingsBytes / originalSize) * 100);

  return (
    <div className="space-y-8">
      {/* Tool Header & SEO breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image Compressor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Reduce image file size with lossless and lossy precision without noticeable visual loss.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAnother}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            + Add Images
          </button>
          {files.length > 1 && (
            <button
              onClick={handleDownloadAllBatch}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              <FileArchive className="w-3.5 h-3.5" />
              Download All ({files.length})
            </button>
          )}
        </div>
      </div>

      {/* Multiple Files Strip (if batch) */}
      {files.length > 1 && (
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl overflow-x-auto flex gap-3">
          {files.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFileId(f.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs whitespace-nowrap transition-all border ${
                selectedFileId === f.id
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <img src={f.previewUrl} alt={f.name} className="w-8 h-8 rounded object-cover" />
              <div className="max-w-[120px] truncate">
                <div className="font-semibold text-slate-900 dark:text-white truncate">{f.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{formatBytes(f.originalSize)}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Preview & Before/After Slider */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              Interactive Split Comparator (Slide to Inspect)
            </span>
            <button
              onClick={() => setIsComparing(!isComparing)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isComparing ? 'Side-by-Side View' : 'Split Slider View'}
            </button>
          </div>

          {/* Preview Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard min-h-[350px] flex items-center justify-center shadow-inner">
            {isComparing ? (
              // Split Slider View
              <div
                className="relative w-full h-[450px] select-none overflow-hidden cursor-ew-resize"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, pos)));
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((touch.clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, pos)));
                }}
              >
                {/* Background: Compressed */}
                <img
                  src={currentFile.processedUrl || currentFile.previewUrl}
                  alt="Compressed version"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Foreground: Original (clipped by slider) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={currentFile.previewUrl}
                    alt="Original version"
                    className="absolute inset-0 w-full h-full object-contain max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    ↔
                  </div>
                </div>

                {/* Overlaid Badges */}
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white">
                  Original: {formatBytes(originalSize)}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-indigo-600/90 backdrop-blur-sm text-[11px] font-medium text-white">
                  Compressed: {formatBytes(compressedSize)} ({savingsPercent > 0 ? `-${savingsPercent}%` : '0%'})
                </div>
              </div>
            ) : (
              // Side-by-Side View
              <div className="grid grid-cols-2 gap-2 p-4 w-full h-[450px]">
                <div className="relative border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center">
                  <img src={currentFile.previewUrl} alt="Original" className="max-h-[360px] object-contain" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                    Original ({formatBytes(originalSize)})
                  </div>
                </div>
                <div className="relative border border-indigo-200 dark:border-indigo-900/50 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center">
                  <img src={currentFile.processedUrl || currentFile.previewUrl} alt="Compressed" className="max-h-[360px] object-contain" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600 text-[10px] text-white">
                    Compressed ({formatBytes(compressedSize)})
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning Message if file size budget could not be reached */}
          {warningMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Compression Controls & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metrics summary card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Compression Metrics
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Original</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                  {formatBytes(originalSize)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400">Compressed</div>
                <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300 font-mono tabular-nums mt-0.5">
                  {formatBytes(compressedSize)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Saved</div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums mt-0.5">
                  {savingsPercent > 0 ? `-${savingsPercent}%` : '0%'}
                </div>
              </div>
            </div>

            {savingsBytes > 0 && (
              <div className="text-xs text-center text-slate-500 font-medium">
                Saved <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatBytes(savingsBytes)}</span> of bandwidth per load!
              </div>
            )}
          </div>

          {/* Control Settings Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Target Output Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'webp', label: 'WebP', desc: 'Recommended' },
                  { id: 'jpeg', label: 'JPG', desc: 'Standard' },
                  { id: 'png', label: 'PNG', desc: 'Lossless' },
                  { id: 'avif', label: 'AVIF', desc: 'Ultra-small' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setTargetFormat(fmt.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      targetFormat === fmt.id
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{fmt.label}</div>
                    <div className="text-[9px] text-slate-400 font-normal">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Toggle: Quality vs Max File Size */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Compression Method
                </span>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setUseTargetSize(false)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      !useTargetSize
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Quality Slider
                  </button>
                  <button
                    onClick={() => setUseTargetSize(true)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      useTargetSize
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Target Max Size
                  </button>
                </div>
              </div>

              {!useTargetSize ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Visual Quality</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Smallest File (5%)</span>
                    <span>Balanced (80%)</span>
                    <span>Best Quality (100%)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Maximum Target Size</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{targetSizeKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="2000"
                    step="10"
                    value={targetSizeKb}
                    onChange={(e) => setTargetSizeKb(Number(e.target.value))}
                    className="w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex items-center gap-2">
                    {[50, 100, 200, 500].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTargetSizeKb(preset)}
                        className={`px-2 py-1 text-[11px] rounded border font-mono ${
                          targetSizeKb === preset
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        {preset} KB
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                onClick={handleDownloadSingle}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download Compressed ({targetFormat.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
