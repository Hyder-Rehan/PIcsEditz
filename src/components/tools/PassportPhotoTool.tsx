import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, ShieldAlert, Sparkles, Check, Info, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { ImageFileItem, PassportPreset } from '../../types';
import { PASSPORT_PRESETS } from '../../data/presets';
import { downloadFile, generatePassportPhoto, loadImageFromFile } from '../../utils/imageProcessors';

interface PassportPhotoToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const PassportPhotoTool: React.FC<PassportPhotoToolProps> = ({ files, onUpdateFile, onSelectAnother }) => {
  const currentFile = files[0];

  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PASSPORT_PRESETS[0]);
  const [dpi, setDpi] = useState<number>(300);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [outputMode, setOutputMode] = useState<'single' | 'sheet_4x6'>('single');
  const [sheetCopies, setSheetCopies] = useState<number>(6);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);

  // Pan & Zoom controls for face alignment
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Compute pixel target dimensions based on mm and DPI
  // 1 inch = 25.4 mm
  const targetPxW = Math.round((selectedPreset.widthMm / 25.4) * dpi);
  const targetPxH = Math.round((selectedPreset.heightMm / 25.4) * dpi);

  // Generate Passport preview
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const generate = async () => {
      setIsProcessing(true);
      try {
        const { img } = await loadImageFromFile(currentFile.file);

        // Calculate crop area inside source image considering zoom and pan
        const baseCropSize = Math.min(img.width, img.height);
        const cropW = (baseCropSize / zoom);
        const cropH = (cropW * (targetPxH / targetPxW));

        const maxPanX = (img.width - cropW) / 2;
        const maxPanY = (img.height - cropH) / 2;

        const effectivePanX = (panX / 100) * maxPanX;
        const effectivePanY = (panY / 100) * maxPanY;

        const cropX = Math.max(0, Math.min(img.width - cropW, (img.width - cropW) / 2 + effectivePanX));
        const cropY = Math.max(0, Math.min(img.height - cropH, (img.height - cropH) / 2 + effectivePanY));

        const canvas = generatePassportPhoto(
          img,
          { x: cropX, y: cropY, width: cropW, height: cropH },
          targetPxW,
          targetPxH,
          bgColor,
          outputMode,
          sheetCopies
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
        if (isMounted) setPreviewUrl(dataUrl);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const timer = setTimeout(generate, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentFile?.file, selectedPreset, dpi, bgColor, outputMode, sheetCopies, zoom, panX, panY]);

  const handleDownload = () => {
    if (!previewUrl || !currentFile) return;
    const modeStr = outputMode === 'sheet_4x6' ? '4x6-sheet' : 'single';
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    downloadFile(previewUrl, `${baseName}-passport-${selectedPreset.country.toLowerCase().replace(/\s+/g, '-')}-${modeStr}.jpg`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Passport Photo Sheet</title>
          <style>
            @page { size: auto; margin: 0; }
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please upload a portrait image to generate passport photos.</p>
        <button onClick={onSelectAnother} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Upload Portrait Photo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Passport Size Photo Maker</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate official biometric photos for US, UK, Schengen, India, and Canada with printable 4x6&quot; sheets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAnother}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Official compliance advisory banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Biometric Requirement Notice</span>
          <p className="text-indigo-800/80 dark:text-indigo-400 mt-0.5">
            Always verify requirements with the official embassy or passport office for your destination. Ensure direct eye contact, neutral facial expression, no hats, and un-tinted glasses without glare.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Preview & Biometric Alignment Overlay */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              {outputMode === 'single'
                ? `Single Photo (${selectedPreset.widthMm}×${selectedPreset.heightMm} mm @ ${dpi} DPI)`
                : `Printable 4×6" Sheet (${sheetCopies} Photos with cut guides)`}
            </span>
            {outputMode === 'single' && (
              <label className="flex items-center gap-1.5 cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
                <input
                  type="checkbox"
                  checked={showFaceGuide}
                  onChange={(e) => setShowFaceGuide(e.target.checked)}
                />
                <span>Biometric Face Guide Overlay</span>
              </label>
            )}
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/70 h-[480px] flex items-center justify-center shadow-inner p-4">
            {previewUrl ? (
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Passport preview"
                  className="max-h-[440px] object-contain rounded shadow-lg border border-slate-300 dark:border-slate-700"
                />

                {/* Biometric Oval Guide Overlay (Single Mode only) */}
                {outputMode === 'single' && showFaceGuide && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Head oval */}
                    <div className="w-[58%] h-[68%] rounded-[50%/60%] border-2 border-indigo-500/80 border-dashed relative">
                      {/* Eye level line */}
                      <div className="absolute top-[42%] left-0 right-0 border-t border-indigo-400/80 flex items-center justify-between px-1">
                        <span className="text-[9px] font-bold text-indigo-600 bg-white/80 rounded px-1 -translate-y-1/2">
                          Eye Level
                        </span>
                      </div>
                      {/* Chin level line */}
                      <div className="absolute bottom-0 left-0 right-0 border-t border-indigo-400/80 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-indigo-600 bg-white/80 rounded px-1 -translate-y-1/2">
                          Chin Line
                        </span>
                      </div>
                    </div>
                    {/* Headroom indicator */}
                    <div className="absolute top-2 text-[10px] font-semibold text-indigo-600 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                      Headroom (Top of Head)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 text-xs">Generating biometric photo...</div>
            )}
          </div>

          {/* Alignment controls (Zoom & Pan) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Face Zoom</span>
                <span className="font-mono font-bold text-indigo-600">{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Move Vertical (Up/Down)</span>
                <span className="font-mono font-bold text-indigo-600">{panY}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={panY}
                onChange={(e) => setPanY(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Move Horizontal (Left/Right)</span>
                <span className="font-mono font-bold text-indigo-600">{panX}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={panX}
                onChange={(e) => setPanX(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Country Presets & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            {/* Country Preset Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Destination Country / Specification
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {PASSPORT_PRESETS.map((p) => {
                  const isSelected = selectedPreset.name === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(p);
                        setBgColor(p.bgColor);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{p.widthMm}×{p.heightMm} mm ({p.widthInches}×{p.heightInches}&quot;)</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Preset notes */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                {selectedPreset.notes}
              </p>
            </div>

            {/* Background Color & Print DPI */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Background Color
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {[
                      { name: 'White', hex: '#ffffff' },
                      { name: 'Light Blue', hex: '#dce7f7' },
                      { name: 'Light Grey', hex: '#f1f5f9' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBgColor(c.hex)}
                        title={c.name}
                        className={`w-6 h-6 rounded border shadow-xs ${
                          bgColor.toLowerCase() === c.hex.toLowerCase() ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Print Resolution (DPI)
                </span>
                <div className="flex gap-1">
                  {[300, 600].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDpi(d)}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg border ${
                        dpi === d ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Mode: Single Photo vs 4x6 Printable Sheet */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Export Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOutputMode('single')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    outputMode === 'single'
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs">Single Photo</div>
                  <div className="text-[10px] text-slate-400">1 high-res file</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOutputMode('sheet_4x6')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    outputMode === 'sheet_4x6'
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs">Printable 4×6&quot; Sheet</div>
                  <div className="text-[10px] text-slate-400">Multi-copy print grid</div>
                </button>
              </div>

              {outputMode === 'sheet_4x6' && (
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Copies on sheet:</span>
                  <div className="flex gap-2">
                    {[4, 6, 8].map((copies) => (
                      <button
                        key={copies}
                        type="button"
                        onClick={() => setSheetCopies(copies)}
                        className={`px-3 py-1 rounded-lg border font-mono font-bold ${
                          sheetCopies === copies ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        {copies} Photos
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessing || !previewUrl}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {outputMode === 'single' ? 'Download Passport Photo (JPG)' : 'Download 4×6" Print Sheet'}
                </span>
              </button>

              {outputMode === 'sheet_4x6' && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Send to Printer (4×6&quot; Standard)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
