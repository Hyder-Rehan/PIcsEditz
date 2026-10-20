import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Download, Maximize2, RefreshCw, Sparkles, Check } from 'lucide-react';
import { ImageFileItem } from '../../types';
import { DIMENSION_PRESETS } from '../../data/presets';
import { downloadFile, formatBytes, loadImageFromFile, resizeImageToCanvas } from '../../utils/imageProcessors';

interface ResizerToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const ResizerTool: React.FC<ResizerToolProps> = ({ files, onUpdateFile, onSelectAnother }) => {
  const currentFile = files[0];
  const [width, setWidth] = useState<number>(currentFile?.originalWidth || 1200);
  const [height, setHeight] = useState<number>(currentFile?.originalHeight || 800);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [fitMode, setFitMode] = useState<'fill' | 'contain' | 'cover'>('cover');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [format, setFormat] = useState<string>('png');
  const [percentage, setPercentage] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewCanvasUrl, setPreviewCanvasUrl] = useState<string>('');

  const originalAspectRatio = useRef<number>((currentFile?.originalWidth || 1) / (currentFile?.originalHeight || 1));

  // Initialize dimensions from loaded file
  useEffect(() => {
    if (currentFile) {
      setWidth(currentFile.originalWidth || 1200);
      setHeight(currentFile.originalHeight || 800);
      originalAspectRatio.current = (currentFile.originalWidth || 1) / (currentFile.originalHeight || 1);
    }
  }, [currentFile?.id]);

  // Generate preview when dimension or fit mode updates
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const generatePreview = async () => {
      try {
        setIsProcessing(true);
        const { img } = await loadImageFromFile(currentFile.file);
        const canvas = resizeImageToCanvas(img, width, height, fitMode, bgColor);
        const dataUrl = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`);
        if (isMounted) {
          setPreviewCanvasUrl(dataUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const timer = setTimeout(generatePreview, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [width, height, fitMode, bgColor, format, currentFile?.file]);

  const handleWidthChange = (val: number) => {
    const newW = Math.max(1, Math.round(val));
    setWidth(newW);
    if (lockAspect && originalAspectRatio.current > 0) {
      setHeight(Math.max(1, Math.round(newW / originalAspectRatio.current)));
    }
  };

  const handleHeightChange = (val: number) => {
    const newH = Math.max(1, Math.round(val));
    setHeight(newH);
    if (lockAspect && originalAspectRatio.current > 0) {
      setWidth(Math.max(1, Math.round(newH * originalAspectRatio.current)));
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (!currentFile) return;
    const ratio = pct / 100;
    setWidth(Math.max(1, Math.round(currentFile.originalWidth * ratio)));
    setHeight(Math.max(1, Math.round(currentFile.originalHeight * ratio)));
  };

  const handleApplyPreset = (presetW: number, presetH: number) => {
    setLockAspect(false);
    setWidth(presetW);
    setHeight(presetH);
  };

  const handleDownload = () => {
    if (!previewCanvasUrl || !currentFile) return;
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    downloadFile(previewCanvasUrl, `${baseName}-resized-${width}x${height}.${format}`);
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please upload an image to resize.</p>
        <button onClick={onSelectAnother} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Upload Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image Resizer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scale dimensions with aspect ratio lock, social media presets, or percentage scaling.
          </p>
        </div>
        <button
          onClick={onSelectAnother}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Change Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Preview Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Live Output Preview</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {width} × {height} px
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center shadow-inner p-4">
            {previewCanvasUrl ? (
              <img
                src={previewCanvasUrl}
                alt="Resized preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Rendering preview...</span>
              </div>
            )}

            {/* Dimension Badge */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-mono text-white flex items-center gap-2">
              <span>Target: {width} × {height}</span>
              <span className="text-slate-400">·</span>
              <span>Original: {currentFile.originalWidth} × {currentFile.originalHeight}</span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Custom Dimension Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Exact Dimensions (Pixels)
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 block">Width (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Lock aspect ratio button */}
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    lockAspect
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex-1">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 block">Height (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Percentage shortcuts */}
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">Scale by Percentage</div>
              <div className="grid grid-cols-5 gap-1.5">
                {[25, 50, 75, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageChange(pct)}
                    className="py-1.5 px-2 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Fit mode selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
                Scale & Fit Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cover', label: 'Cover / Crop', desc: 'Fills without stretch' },
                  { id: 'contain', label: 'Contain / Pad', desc: 'Adds background margin' },
                  { id: 'fill', label: 'Exact Fill', desc: 'Fits dimensions' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFitMode(mode.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      fitMode === mode.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs">{mode.label}</div>
                    <div className="text-[9px] text-slate-400 font-normal">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {fitMode === 'contain' && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Padding Color:</span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{bgColor}</span>
                </div>
              )}
            </div>

            {/* Output format */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Export Format</span>
                <div className="flex gap-2">
                  {['png', 'webp', 'jpg'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`px-2.5 py-1 text-xs uppercase font-bold rounded-lg border ${
                        format === fmt
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Download CTA */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized Image</span>
            </button>
          </div>

          {/* Social Presets Section */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Popular Dimension Presets
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {DIMENSION_PRESETS.slice(0, 8).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset.width, preset.height)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{preset.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({preset.description})</span>
                  </div>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    {preset.width}×{preset.height}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
