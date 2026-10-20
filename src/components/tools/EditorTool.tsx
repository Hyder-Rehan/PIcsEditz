import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Type,
  Square,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Eye,
  Crop as CropIcon,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';
import { ImageAdjustments, ImageFileItem, TextOverlay } from '../../types';
import { downloadFile, loadImageFromFile, renderEditedImage } from '../../utils/imageProcessors';

interface EditorToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  sharpness: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
};

export const EditorTool: React.FC<EditorToolProps> = ({ files, onUpdateFile, onSelectAnother }) => {
  const currentFile = files[0];

  const [activeTab, setActiveTab] = useState<'adjust' | 'crop' | 'text' | 'frame'>('adjust');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);

  // Undo/Redo history
  const [history, setHistory] = useState<ImageAdjustments[]>([DEFAULT_ADJUSTMENTS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Overlays & Frames
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [frameConfig, setFrameConfig] = useState({
    borderWidth: 0,
    borderColor: '#ffffff',
    borderRadius: 0,
    vignette: 0
  });

  // Aspect ratio crop state
  const [selectedCropAspect, setSelectedCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9' | '9:16'>('free');

  // Preview & Compare
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [format, setFormat] = useState<string>('png');

  // Push to history when adjustments change (debounced)
  const pushToHistory = (newAdj: ImageAdjustments) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newAdj);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleAdjustChange = (key: keyof ImageAdjustments, val: any) => {
    setAdjustments((prev) => {
      const next = { ...prev, [key]: val };
      return next;
    });
  };

  // Debounced push to history on slider release
  const handleSliderEnd = () => {
    pushToHistory(adjustments);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setAdjustments(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setAdjustments(next);
    }
  };

  const handleReset = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setTextOverlays([]);
    setFrameConfig({ borderWidth: 0, borderColor: '#ffffff', borderRadius: 0, vignette: 0 });
    pushToHistory(DEFAULT_ADJUSTMENTS);
  };

  // Re-render edited canvas
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const render = async () => {
      try {
        const { img } = await loadImageFromFile(currentFile.file);

        let cropRect: { x: number; y: number; width: number; height: number } | undefined;
        if (selectedCropAspect !== 'free') {
          // Calculate center crop rect for aspect ratio
          const [rw, rh] = selectedCropAspect.split(':').map(Number);
          const targetRatio = rw / rh;
          const imgRatio = img.width / img.height;
          if (imgRatio > targetRatio) {
            const cropW = img.height * targetRatio;
            cropRect = {
              x: (img.width - cropW) / 2,
              y: 0,
              width: cropW,
              height: img.height
            };
          } else {
            const cropH = img.width / targetRatio;
            cropRect = {
              x: 0,
              y: (img.height - cropH) / 2,
              width: img.width,
              height: cropH
            };
          }
        }

        const canvas = renderEditedImage(img, adjustments, cropRect, textOverlays, frameConfig);
        const dataUrl = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`, 0.95);
        if (isMounted) setPreviewUrl(dataUrl);
      } catch (e) {
        console.error(e);
      }
    };

    const timer = setTimeout(render, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [adjustments, selectedCropAspect, textOverlays, frameConfig, format, currentFile?.file]);

  const handleAddText = () => {
    const newOverlay: TextOverlay = {
      id: 'txt-' + Date.now(),
      text: 'Sample Heading',
      x: 50,
      y: 50,
      fontSize: 36,
      color: '#ffffff',
      bgColor: 'transparent',
      fontFamily: 'Plus Jakarta Sans',
      bold: true,
      outline: true
    };
    setTextOverlays([...textOverlays, newOverlay]);
  };

  const handleDownload = () => {
    if (!previewUrl || !currentFile) return;
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    downloadFile(previewUrl, `${baseName}-edited.${format}`);
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please upload an image to edit.</p>
        <button onClick={onSelectAnother} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Upload Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Full Image Editor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Crop, rotate, fine-tune lighting, apply cinema filters, add text overlays, and frame your photos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* History undo/redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset to Original"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onSelectAnother}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            Change Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Editor Viewport</span>
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium select-none cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Hold to See Original</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[480px] flex items-center justify-center shadow-inner p-4">
            <img
              src={showOriginal ? currentFile.previewUrl : previewUrl || currentFile.previewUrl}
              alt="Editor preview"
              className="max-h-full max-w-full object-contain rounded-lg shadow-md transition-all duration-75"
            />

            {showOriginal && (
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/80 text-xs font-bold text-white uppercase tracking-wider">
                Original Image
              </div>
            )}
          </div>

          {/* Quick Transformations Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">Transform:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextRot = (adjustments.rotation + 90) % 360;
                  handleAdjustChange('rotation', nextRot);
                  pushToHistory({ ...adjustments, rotation: nextRot });
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAdjustChange('flipH', !adjustments.flipH);
                  pushToHistory({ ...adjustments, flipH: !adjustments.flipH });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border font-medium ${
                  adjustments.flipH ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip Horiz</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAdjustChange('flipV', !adjustments.flipV);
                  pushToHistory({ ...adjustments, flipV: !adjustments.flipV });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border font-medium ${
                  adjustments.flipV ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip Vert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Editor Controls Sub-Tabs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            {/* 4 Feature Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              {[
                { id: 'adjust', label: 'Adjust', icon: Sliders },
                { id: 'crop', label: 'Crop', icon: CropIcon },
                { id: 'text', label: 'Text', icon: Type },
                { id: 'frame', label: 'Frame', icon: Square },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all ${
                      activeTab === t.id
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Lighting & Color Adjustments */}
            {activeTab === 'adjust' && (
              <div className="space-y-4">
                {/* Sliders */}
                {[
                  { label: 'Brightness', key: 'brightness', min: -80, max: 80, unit: '%' },
                  { label: 'Contrast', key: 'contrast', min: -80, max: 80, unit: '%' },
                  { label: 'Saturation', key: 'saturation', min: -100, max: 100, unit: '%' },
                  { label: 'Grayscale', key: 'grayscale', min: 0, max: 100, unit: '%' },
                  { label: 'Sepia Vintage', key: 'sepia', min: 0, max: 100, unit: '%' },
                  { label: 'Blur Softness', key: 'blur', min: 0, max: 15, unit: 'px' },
                ].map((s) => (
                  <div key={s.key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-400">{s.label}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {(adjustments as any)[s.key]}{s.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      value={(adjustments as any)[s.key]}
                      onChange={(e) => handleAdjustChange(s.key as any, Number(e.target.value))}
                      onMouseUp={handleSliderEnd}
                      onTouchEnd={handleSliderEnd}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Aspect Ratio Crop */}
            {activeTab === 'crop' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                  Select Preset Crop Aspect Ratio:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'free', label: 'Full Original', ratio: 'No Crop' },
                    { id: '1:1', label: '1:1 Square', ratio: 'Instagram / Avatar' },
                    { id: '4:3', label: '4:3 Standard', ratio: 'Photo / Tablet' },
                    { id: '16:9', label: '16:9 Cinema', ratio: 'YouTube / Banner' },
                    { id: '9:16', label: '9:16 Story', ratio: 'Reels / TikTok' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCropAspect(c.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedCropAspect === c.id
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs">{c.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.ratio}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Text Overlays */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Overlaid Captions</span>
                  <button
                    onClick={handleAddText}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Text</span>
                  </button>
                </div>

                {textOverlays.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                    No text overlays added yet. Click &quot;Add Text&quot; to caption your photo!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {textOverlays.map((t, idx) => (
                      <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={t.text}
                            onChange={(e) => {
                              const updated = [...textOverlays];
                              updated[idx].text = e.target.value;
                              setTextOverlays(updated);
                            }}
                            className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            placeholder="Enter caption..."
                          />
                          <button
                            onClick={() => setTextOverlays(textOverlays.filter((_, i) => i !== idx))}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500">Font Size: {t.fontSize}px</span>
                            <input
                              type="range"
                              min="14"
                              max="96"
                              value={t.fontSize}
                              onChange={(e) => {
                                const updated = [...textOverlays];
                                updated[idx].fontSize = Number(e.target.value);
                                setTextOverlays(updated);
                              }}
                              className="w-full h-1"
                            />
                          </div>

                          <div>
                            <span className="text-slate-500">Vertical Position: {t.y}%</span>
                            <input
                              type="range"
                              min="5"
                              max="95"
                              value={t.y}
                              onChange={(e) => {
                                const updated = [...textOverlays];
                                updated[idx].y = Number(e.target.value);
                                setTextOverlays(updated);
                              }}
                              className="w-full h-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-500">Color:</span>
                          <input
                            type="color"
                            value={t.color}
                            onChange={(e) => {
                              const updated = [...textOverlays];
                              updated[idx].color = e.target.value;
                              setTextOverlays(updated);
                            }}
                            className="w-5 h-5 rounded cursor-pointer"
                          />
                          <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 ml-auto cursor-pointer">
                            <input
                              type="checkbox"
                              checked={t.outline}
                              onChange={(e) => {
                                const updated = [...textOverlays];
                                updated[idx].outline = e.target.checked;
                                setTextOverlays(updated);
                              }}
                            />
                            <span>Black Stroke</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Borders & Vignette Frame */}
            {activeTab === 'frame' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Border Width</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{frameConfig.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={frameConfig.borderWidth}
                    onChange={(e) => setFrameConfig({ ...frameConfig, borderWidth: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                {frameConfig.borderWidth > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Border Color:</span>
                    <input
                      type="color"
                      value={frameConfig.borderColor}
                      onChange={(e) => setFrameConfig({ ...frameConfig, borderColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono">{frameConfig.borderColor}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Vignette Darkness</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{frameConfig.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={frameConfig.vignette}
                    onChange={(e) => setFrameConfig({ ...frameConfig, vignette: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Format & Download */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Download Format</span>
                <div className="flex gap-1.5">
                  {['png', 'jpg', 'webp'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        format === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Edited Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
