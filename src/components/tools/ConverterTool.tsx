import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, AlertTriangle, CheckCircle2, FileCode, Check } from 'lucide-react';
import { ImageFileItem } from '../../types';
import { downloadFile, formatBytes, getMimeType, isFormatSupported, loadImageFromFile } from '../../utils/imageProcessors';

interface ConverterToolProps {
  files: ImageFileItem[];
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const ConverterTool: React.FC<ConverterToolProps> = ({ files, onUpdateFile, onSelectAnother }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('webp');
  const [jpegFillColor, setJpegFillColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [convertedUrls, setConvertedUrls] = useState<Record<string, { url: string; size: number }>>({});
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');

  const availableFormats = [
    { id: 'webp', name: 'WebP', ext: 'webp', mime: 'image/webp', desc: 'Modern web format with high compression & alpha' },
    { id: 'png', name: 'PNG', ext: 'png', mime: 'image/png', desc: 'Lossless raster with full transparency support' },
    { id: 'jpg', name: 'JPG / JPEG', ext: 'jpg', mime: 'image/jpeg', desc: 'Universal photograph format (opaque only)' },
    { id: 'avif', name: 'AVIF', ext: 'avif', mime: 'image/avif', desc: 'Next-gen AV1 codec image format' },
    { id: 'bmp', name: 'BMP', ext: 'bmp', mime: 'image/bmp', desc: 'Uncompressed Windows Bitmap raster' },
    { id: 'gif', name: 'GIF', ext: 'gif', mime: 'image/gif', desc: 'Single frame raster graphic' },
  ];

  const currentFile = files.find((f) => f.id === selectedFileId) || files[0];

  // Convert files whenever settings or selection changes
  useEffect(() => {
    if (!currentFile) return;

    let isMounted = true;
    const processConversion = async () => {
      setIsProcessing(true);
      try {
        const { img } = await loadImageFromFile(currentFile.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get context');

        const mime = getMimeType(selectedFormat);

        // If target is JPEG and doesn't support transparency, draw background fill first
        if (mime === 'image/jpeg') {
          ctx.fillStyle = jpegFillColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob && isMounted) {
              const url = URL.createObjectURL(blob);
              setConvertedUrls((prev) => ({
                ...prev,
                [currentFile.id]: { url, size: blob.size }
              }));
              setIsProcessing(false);
            }
          },
          mime,
          quality / 100
        );
      } catch (err) {
        console.error(err);
        if (isMounted) setIsProcessing(false);
      }
    };

    processConversion();
    return () => {
      isMounted = false;
    };
  }, [currentFile?.id, selectedFormat, jpegFillColor, quality]);

  const handleDownloadSingle = () => {
    if (!currentFile) return;
    const item = convertedUrls[currentFile.id];
    if (!item) return;
    const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
    downloadFile(item.url, `${baseName}-converted.${selectedFormat}`);
  };

  const handleDownloadAllBatch = async () => {
    setIsProcessing(true);
    for (const f of files) {
      try {
        const { img } = await loadImageFromFile(f.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (selectedFormat === 'jpg' || selectedFormat === 'jpeg') {
            ctx.fillStyle = jpegFillColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const mime = getMimeType(selectedFormat);
          canvas.toBlob(
            (b) => {
              if (b) {
                const url = URL.createObjectURL(b);
                const base = f.name.substring(0, f.name.lastIndexOf('.')) || f.name;
                downloadFile(url, `${base}-converted.${selectedFormat}`);
              }
            },
            mime,
            quality / 100
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsProcessing(false);
  };

  if (!currentFile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please upload an image to convert.</p>
        <button onClick={onSelectAnother} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Upload Image
        </button>
      </div>
    );
  }

  const currentResult = convertedUrls[currentFile.id];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image Format Converter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Convert images securely between WebP, PNG, JPG, AVIF, BMP, and GIF with full transparency awareness.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAnother}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            + Add Files
          </button>
          {files.length > 1 && (
            <button
              onClick={handleDownloadAllBatch}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              Convert & Download All ({files.length})
            </button>
          )}
        </div>
      </div>

      {/* Multiple Files Strip */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Converted Preview ({selectedFormat.toUpperCase()})</span>
            {currentResult && (
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {formatBytes(currentResult.size)}
              </span>
            )}
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center shadow-inner p-4">
            {currentResult?.url ? (
              <img
                src={currentResult.url}
                alt="Converted preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Converting image...</span>
              </div>
            )}
          </div>

          {/* Transparency Warning for JPG */}
          {(selectedFormat === 'jpg' || selectedFormat === 'jpeg') && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">JPG Format Transparency Notice</span>
                <p className="mt-0.5 text-amber-800 dark:text-amber-400">
                  The JPEG specification does not support alpha channel transparency. Transparent areas will be rendered using the background color selected on the right (default white). For transparency, select <strong className="underline">PNG</strong> or <strong className="underline">WebP</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Format Selector & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Output Format
            </h3>

            <div className="space-y-2">
              {availableFormats.map((fmt) => {
                const supported = isFormatSupported(fmt.mime);
                const isSelected = selectedFormat === fmt.id;

                return (
                  <button
                    key={fmt.id}
                    type="button"
                    disabled={!supported}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-xs'
                        : supported
                        ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        : 'border-slate-100 dark:border-slate-900 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                          {fmt.name}
                        </span>
                        {!supported && (
                          <span className="text-[10px] text-amber-500 font-medium">Browser unsupported</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{fmt.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* JPG Background Color Picker */}
            {(selectedFormat === 'jpg' || selectedFormat === 'jpeg') && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">JPG Matte Fill Color</span>
                  <span className="font-mono text-slate-500">{jpegFillColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={jpegFillColor}
                    onChange={(e) => setJpegFillColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <div className="flex gap-1.5">
                    {['#ffffff', '#000000', '#f1f5f9', '#fef08a', '#dcfce7'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setJpegFillColor(c)}
                        className="w-6 h-6 rounded-md border border-slate-300 shadow-xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quality Slider for lossy formats */}
            {(selectedFormat === 'webp' || selectedFormat === 'jpg' || selectedFormat === 'jpeg' || selectedFormat === 'avif') && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-400">Quality</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Download CTA */}
            <button
              type="button"
              onClick={handleDownloadSingle}
              disabled={isProcessing || !currentResult}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download .{selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
