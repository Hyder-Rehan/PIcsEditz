import React, { useState, useEffect, useRef } from 'react';
import { Download, Sliders, Eraser, Paintbrush, Undo2, Sparkles, Check, Image as ImageIcon, Palette, Eye } from 'lucide-react';
import { ImageFileItem } from '../../types';
import { compositeBackground, downloadFile, loadImageFromFile, removeBackgroundCanvas } from '../../utils/imageProcessors';

interface BackgroundToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const BackgroundTool: React.FC<BackgroundToolProps> = ({ files, onUpdateFile, onSelectAnother }) => {
  const currentFile = files[0];

  // Removal parameters
  const [tolerance, setTolerance] = useState<number>(32);
  const [feather, setFeather] = useState<number>(2);

  // Background replacement
  const [bgType, setBgType] = useState<'transparent' | 'solid' | 'gradient' | 'image'>('transparent');
  const [solidColor, setSolidColor] = useState<string>('#ffffff');
  const [selectedGradient, setSelectedGradient] = useState<{ name: string; color1: string; color2: string; angle: number }>({
    name: 'Cyber Indigo',
    color1: '#4338ca',
    color2: '#06b6d4',
    angle: 135
  });
  const [customBgImage, setCustomBgImage] = useState<HTMLImageElement | null>(null);

  // Brush Eraser / Restore
  const [activeBrush, setActiveBrush] = useState<'none' | 'erase' | 'restore'>('none');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // State canvases
  const [transparentCanvas, setTransparentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [finalPreviewUrl, setFinalPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  // Predefined Studio Gradients & Colors
  const solidPresets = [
    { name: 'Pure White (Passport / E-Com)', hex: '#ffffff' },
    { name: 'Off-White / Cream', hex: '#f8fafc' },
    { name: 'Schengen / Visa Blue', hex: '#dce7f7' },
    { name: 'Studio Neutral Grey', hex: '#e2e8f0' },
    { name: 'Slate Dark Luxury', hex: '#0f172a' },
    { name: 'Warm Peach', hex: '#fed7aa' },
    { name: 'Sage Green', hex: '#bbf7d0' },
    { name: 'Midnight Navy', hex: '#1e1b4b' },
  ];

  const gradientPresets = [
    { name: 'Cyber Indigo', color1: '#4338ca', color2: '#06b6d4', angle: 135 },
    { name: 'Studio Sunset', color1: '#f97316', color2: '#ec4899', angle: 135 },
    { name: 'Executive Grey', color1: '#334155', color2: '#0f172a', angle: 180 },
    { name: 'Emerald Velvet', color1: '#047857', color2: '#10b981', angle: 135 },
    { name: 'Pastel Aura', color1: '#e0e7ff', color2: '#fae8ff', angle: 90 },
    { name: 'Vibrant Aurora', color1: '#8b5cf6', color2: '#f43f5e', angle: 120 },
  ];

  // Initial Background Removal
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const processRemoval = async () => {
      setIsProcessing(true);
      try {
        const { img } = await loadImageFromFile(currentFile.file);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const fg = removeBackgroundCanvas(tempCanvas, tolerance, feather);
          if (isMounted) {
            setTransparentCanvas(fg);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const timer = setTimeout(processRemoval, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentFile?.id, tolerance, feather]);

  // Composite whenever foreground or background settings change
  useEffect(() => {
    if (!transparentCanvas) return;

    const result = compositeBackground(transparentCanvas, bgType, {
      solidColor,
      gradient: { type: 'linear', ...selectedGradient },
      bgImage: customBgImage || undefined
    });

    const url = result.toDataURL(bgType === 'transparent' ? 'image/png' : 'image/jpeg', 0.95);
    setFinalPreviewUrl(url);

    // Sync to visual canvasRef if mounted for manual brush
    if (canvasRef.current) {
      canvasRef.current.width = result.width;
      canvasRef.current.height = result.height;
      const cCtx = canvasRef.current.getContext('2d');
      if (cCtx) {
        cCtx.drawImage(result, 0, 0);
      }
    }
  }, [transparentCanvas, bgType, solidColor, selectedGradient, customBgImage]);

  // Brush drawing handlers for manual erase / restore
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeBrush === 'none' || !transparentCanvas) return;
    setIsDrawing(true);
    applyBrush(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeBrush === 'none') return;
    applyBrush(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const applyBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !transparentCanvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const fgCtx = transparentCanvas.getContext('2d');
    if (!fgCtx) return;

    fgCtx.save();
    if (activeBrush === 'erase') {
      fgCtx.globalCompositeOperation = 'destination-out';
      fgCtx.beginPath();
      fgCtx.arc(x, y, brushSize * (scaleX || 1), 0, Math.PI * 2);
      fgCtx.fill();
    }
    fgCtx.restore();

    // Trigger re-composite
    const result = compositeBackground(transparentCanvas, bgType, {
      solidColor,
      gradient: { type: 'linear', ...selectedGradient },
      bgImage: customBgImage || undefined
    });
    setFinalPreviewUrl(result.toDataURL(bgType === 'transparent' ? 'image/png' : 'image/jpeg', 0.95));
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = new Image();
      img.onload = () => {
        setCustomBgImage(img);
        setBgType('image');
      };
      img.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (!finalPreviewUrl || !currentFile) return;
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    const ext = bgType === 'transparent' ? 'png' : 'jpg';
    downloadFile(finalPreviewUrl, `${baseName}-bg-${bgType}.${ext}`);
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please upload an image to edit background.</p>
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Background Remover & Changer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Smart client-side edge segmentation, solid color replacement, studio gradients, and custom photo backdrops.
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
        {/* Left: Live Visual Preview / Brush Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              {activeBrush !== 'none'
                ? `Manual Brush Active: ${activeBrush === 'erase' ? 'Erase' : 'Restore'} (Click and drag on canvas)`
                : 'Live Background Preview'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBrush(activeBrush === 'erase' ? 'none' : 'erase')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  activeBrush === 'erase'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser Brush</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[460px] flex items-center justify-center shadow-inner p-4">
            {finalPreviewUrl ? (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`max-h-full max-w-full object-contain rounded-lg shadow-md ${
                  activeBrush === 'erase' ? 'cursor-crosshair' : 'cursor-default'
                }`}
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles className="w-5 h-5 animate-pulse text-indigo-500" />
                <span>Segmenting background...</span>
              </div>
            )}
          </div>

          {/* Browser-native processing disclosure */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>🔒 All background processing runs 100% locally on your machine via HTML5 Canvas.</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">100% Client-Side</span>
          </div>
        </div>

        {/* Right: Controls, Presets & Replacement */}
        <div className="lg:col-span-5 space-y-6">
          {/* Background Replacement Mode */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Replacement Background
            </h3>

            {/* 4 Mode Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              {[
                { id: 'transparent', label: 'Transparent' },
                { id: 'solid', label: 'Solid Color' },
                { id: 'gradient', label: 'Gradient' },
                { id: 'image', label: 'Custom Pic' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBgType(tab.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                    bgType === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mode Specific Controls */}
            {bgType === 'solid' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-400">Choose Preset or Custom Hex</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{solidColor}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {solidPresets.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => setSolidColor(p.hex)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        solidColor.toLowerCase() === p.hex.toLowerCase()
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: p.hex }} />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate w-full">{p.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bgType === 'gradient' && (
              <div className="space-y-3">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">Studio Gradient Themes</span>
                <div className="grid grid-cols-3 gap-2">
                  {gradientPresets.map((g) => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setSelectedGradient(g)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        selectedGradient.name === g.name
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded-lg mb-1 shadow-inner"
                        style={{
                          background: `linear-gradient(${g.angle}deg, ${g.color1}, ${g.color2})`
                        }}
                      />
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {g.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bgType === 'image' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={bgImageInputRef}
                  accept="image/*"
                  onChange={handleCustomBgUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => bgImageInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-500 text-center text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors"
                >
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                  <span>Click to upload custom background wallpaper or room photo</span>
                </button>
              </div>
            )}

            {/* Segmentation Fine-Tuning */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Segmentation Tuning
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Color Sensitivity / Tolerance</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Subtle (Low)</span>
                  <span>Default (32)</span>
                  <span>Aggressive (High)</span>
                </div>
              </div>

              {activeBrush === 'erase' && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Eraser Brush Radius</span>
                    <span className="font-mono font-bold text-rose-600">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Download CTA */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isProcessing || !finalPreviewUrl}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download {bgType === 'transparent' ? 'Transparent PNG' : 'High-Res Photo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
