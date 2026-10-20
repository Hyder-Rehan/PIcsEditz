import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Stamp,
  QrCode,
  Smile,
  Info,
  Grid,
  FileCode,
  Download,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { ImageFileItem, ToolId } from '../../types';
import {
  applyWatermark,
  convertImagesToPdf,
  createCollageCanvas,
  downloadFile,
  extractColorPalette,
  formatBytes,
  generateMemeCanvas,
  generateQrCodeCanvas,
  loadImageFromFile
} from '../../utils/imageProcessors';

interface AdditionalToolsProps {
  files: ImageFileItem[];
  activeSubTool: ToolId;
  onSelectSubTool: (tool: ToolId) => void;
  onUpdateFile: (id: string, updates: Partial<ImageFileItem>) => void;
  onSelectAnother: () => void;
}

export const AdditionalTools: React.FC<AdditionalToolsProps> = ({
  files,
  activeSubTool,
  onSelectSubTool,
  onUpdateFile,
  onSelectAnother
}) => {
  const currentFile = files[0];

  // SUBTOOL: Image to PDF
  const [pdfPageSize, setPdfPageSize] = useState<'a4' | 'letter'>('a4');
  const [pdfOrientation, setPdfOrientation] = useState<'p' | 'l'>('p');
  const [pdfMargin, setPdfMargin] = useState<number>(10);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  // SUBTOOL: Watermark
  const [watermarkText, setWatermarkText] = useState<string>('© OptiPixel 2026');
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'tiled'>('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.6);
  const [watermarkColor, setWatermarkColor] = useState<string>('#ffffff');
  const [watermarkFontSize, setWatermarkFontSize] = useState<number>(32);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string>('');

  // SUBTOOL: QR Code Generator
  const [qrText, setQrText] = useState<string>('https://optipixel.app');
  const [qrDarkColor, setQrDarkColor] = useState<string>('#000000');
  const [qrLightColor, setQrLightColor] = useState<string>('#ffffff');
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');

  // SUBTOOL: Color Palette Extractor
  const [extractedPalette, setExtractedPalette] = useState<{ hex: string; rgb: string; count: number }[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<{ hex: string; rgb: string } | null>(null);

  // SUBTOOL: Meme Generator
  const [memeTop, setMemeTop] = useState<string>('WHEN THE CLIENT SAYS');
  const [memeBottom, setMemeBottom] = useState<string>('MAKE THE LOGO BIGGER');
  const [memePreviewUrl, setMemePreviewUrl] = useState<string>('');

  // SUBTOOL: Collage Maker
  const [collageLayout, setCollageLayout] = useState<'grid-2x2' | 'horizontal-2' | 'vertical-2' | 'trio-1-2'>('grid-2x2');
  const [collageSpacing, setCollageSpacing] = useState<number>(12);
  const [collageBg, setCollageBg] = useState<string>('#ffffff');
  const [collagePreviewUrl, setCollagePreviewUrl] = useState<string>('');

  // SUBTOOL: Bulk Renamer
  const [renamePrefix, setRenamePrefix] = useState<string>('photo');
  const [renameFormat, setRenameFormat] = useState<string>('webp');

  // Load preview effects based on active sub tool
  useEffect(() => {
    if (!currentFile) return;

    const updatePreview = async () => {
      try {
        const { img } = await loadImageFromFile(currentFile.file);

        // Watermark Preview
        if (activeSubTool === 'watermark') {
          const wmCanvas = applyWatermark(img, 'text', {
            text: watermarkText,
            color: watermarkColor,
            opacity: watermarkOpacity,
            position: watermarkPos,
            fontSize: watermarkFontSize
          });
          setWatermarkPreviewUrl(wmCanvas.toDataURL('image/jpeg', 0.9));
        }

        // Meme Preview
        if (activeSubTool === 'meme') {
          const memeCanvas = generateMemeCanvas(img, memeTop, memeBottom);
          setMemePreviewUrl(memeCanvas.toDataURL('image/jpeg', 0.9));
        }

        // Color Palette Extraction
        if (activeSubTool === 'color-picker') {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const palette = extractColorPalette(tempCanvas, 8);
            setExtractedPalette(palette);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    updatePreview();
  }, [
    currentFile?.id,
    activeSubTool,
    watermarkText,
    watermarkPos,
    watermarkOpacity,
    watermarkColor,
    watermarkFontSize,
    memeTop,
    memeBottom
  ]);

  // QR Code generator effect
  useEffect(() => {
    if (activeSubTool === 'qr-code') {
      generateQrCodeCanvas(qrText, {
        colorDark: qrDarkColor,
        colorLight: qrLightColor,
        width: 600
      }).then((canvas) => {
        setQrPreviewUrl(canvas.toDataURL('image/png'));
      });
    }
  }, [activeSubTool, qrText, qrDarkColor, qrLightColor]);

  // Collage generator effect
  useEffect(() => {
    if (activeSubTool === 'collage' && files.length > 0) {
      Promise.all(files.slice(0, 4).map((f) => loadImageFromFile(f.file))).then((results) => {
        const images = results.map((r) => r.img);
        const collage = createCollageCanvas(images, collageLayout, collageSpacing, collageBg);
        setCollagePreviewUrl(collage.toDataURL('image/jpeg', 0.95));
      });
    }
  }, [activeSubTool, files, collageLayout, collageSpacing, collageBg]);

  // Generate Image to PDF
  const handleGeneratePdf = async () => {
    setIsPdfGenerating(true);
    try {
      const items = await Promise.all(
        files.map(async (f) => {
          const { img } = await loadImageFromFile(f.file);
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
          return { canvas: c, name: f.name };
        })
      );

      const blob = await convertImagesToPdf(items, pdfPageSize, pdfOrientation, pdfMargin);
      const url = URL.createObjectURL(blob);
      downloadFile(url, `optipixel-document-${files.length}-pages.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Copy color code
  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // Hover pixel sampler on image
  const handleImagePixelHover = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
      const p = ctx.getImageData(0, 0, 1, 1).data;
      const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
      const hex = `#${toHex(p[0])}${toHex(p[1])}${toHex(p[2])}`;
      setHoverColor({ hex, rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})` });
    }
  };

  // Download Favicon Set
  const handleDownloadFaviconSet = async () => {
    if (!currentFile) return;
    const { img } = await loadImageFromFile(currentFile.file);
    const sizes = [16, 32, 48, 180, 512];

    for (const size of sizes) {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        downloadFile(c.toDataURL('image/png'), `favicon-${size}x${size}.png`);
      }
    }
  };

  // Strip EXIF / Clean metadata download
  const handleDownloadCleanImage = async () => {
    if (!currentFile) return;
    const { img } = await loadImageFromFile(currentFile.file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
      downloadFile(canvas.toDataURL('image/jpeg', 0.95), `${baseName}-privacy-clean.jpg`);
    }
  };

  const subToolsList: { id: ToolId; name: string; icon: any }[] = [
    { id: 'pdf', name: 'Image to PDF', icon: FileText },
    { id: 'watermark', name: 'Watermark', icon: Stamp },
    { id: 'color-picker', name: 'Color Palette & Loupe', icon: Palette },
    { id: 'qr-code', name: 'QR Code Generator', icon: QrCode },
    { id: 'meme', name: 'Meme Generator', icon: Smile },
    { id: 'metadata', name: 'EXIF Metadata & Privacy', icon: Info },
    { id: 'collage', name: 'Collage Maker', icon: Grid },
    { id: 'favicon', name: 'Favicon & App Icons', icon: FileCode },
  ];

  return (
    <div className="space-y-6">
      {/* Subtool Tabs */}
      <div className="p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex flex-wrap gap-1">
        {subToolsList.map((t) => {
          const Icon = t.icon;
          const isSelected = activeSubTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectSubTool(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* 1. IMAGE TO PDF */}
      {activeSubTool === 'pdf' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Convert Images to PDF</h3>
              <p className="text-xs text-slate-500">
                Bundle multiple images into a clean, searchable PDF document with custom margins and orientations.
              </p>
            </div>
            <button
              onClick={onSelectAnother}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200"
            >
              + Add More Pages ({files.length} selected)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Page Format</label>
              <div className="flex gap-2">
                {[
                  { id: 'a4', label: 'A4 Standard' },
                  { id: 'letter', label: 'US Letter' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPdfPageSize(p.id as any)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                      pdfPageSize === p.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Orientation</label>
              <div className="flex gap-2">
                {[
                  { id: 'p', label: 'Portrait' },
                  { id: 'l', label: 'Landscape' }
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setPdfOrientation(o.id as any)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                      pdfOrientation === o.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Page Margin (mm)</label>
              <input
                type="number"
                min="0"
                max="40"
                value={pdfMargin}
                onChange={(e) => setPdfMargin(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Files List Strip */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500">PDF Pages ({files.length}):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {files.map((f, i) => (
                <div key={f.id} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <img src={f.previewUrl} alt={f.name} className="w-8 h-8 rounded object-cover shrink-0" />
                  <span className="text-xs font-medium truncate text-slate-700 dark:text-slate-300">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGeneratePdf}
            disabled={isPdfGenerating || files.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
          >
            {isPdfGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export & Download Combined PDF ({files.length} Pages)</span>
          </button>
        </div>
      )}

      {/* 2. WATERMARK MAKER */}
      {activeSubTool === 'watermark' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center p-4">
            {watermarkPreviewUrl ? (
              <img src={watermarkPreviewUrl} alt="Watermark preview" className="max-h-full max-w-full object-contain rounded shadow" />
            ) : (
              <span className="text-xs text-slate-400">Loading watermark preview...</span>
            )}
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Watermark Settings
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Position</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'center', label: 'Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'tiled', label: 'Diagonal Tiled' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setWatermarkPos(pos.id as any)}
                    className={`p-1.5 rounded-lg border text-center font-medium ${
                      watermarkPos === pos.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Opacity</span>
                <span className="font-mono font-bold text-indigo-600">{Math.round(watermarkOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                if (watermarkPreviewUrl) {
                  downloadFile(watermarkPreviewUrl, 'watermarked-image.jpg');
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Watermarked Image</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. COLOR PALETTE & LOUPE */}
      {activeSubTool === 'color-picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center p-4 relative group">
            <img
              src={currentFile?.previewUrl}
              alt="Color sample"
              onMouseMove={handleImagePixelHover}
              className="max-h-full max-w-full object-contain rounded shadow cursor-crosshair"
            />
            {hoverColor && (
              <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white flex items-center gap-2.5 shadow-lg">
                <div className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: hoverColor.hex }} />
                <span className="font-mono font-bold text-xs">{hoverColor.hex}</span>
                <span className="text-[10px] text-slate-300 font-mono">({hoverColor.rgb})</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Extracted Color Palette
            </h3>
            <p className="text-xs text-slate-500">
              Hover over any pixel on the left to inspect, or click any swatch below to copy its HEX code to clipboard:
            </p>

            <div className="space-y-2">
              {extractedPalette.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleCopyColor(c.hex)}
                  className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-slate-300 shadow-xs" style={{ backgroundColor: c.hex }} />
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{c.hex}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{c.rgb}</span>
                    </div>
                  </div>
                  {copiedHex === c.hex ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. QR CODE GENERATOR */}
      {activeSubTool === 'qr-code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 h-[450px] flex items-center justify-center p-4">
            {qrPreviewUrl ? (
              <img src={qrPreviewUrl} alt="QR Code" className="w-72 h-72 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 bg-white" />
            ) : (
              <span className="text-xs text-slate-400">Rendering QR Code...</span>
            )}
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              QR Code Customizer
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Target URL or Text Message</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">QR Pattern Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrDarkColor}
                    onChange={(e) => setQrDarkColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer"
                  />
                  <span className="font-mono text-xs">{qrDarkColor}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Background Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrLightColor}
                    onChange={(e) => setQrLightColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer"
                  />
                  <span className="font-mono text-xs">{qrLightColor}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (qrPreviewUrl) {
                  downloadFile(qrPreviewUrl, 'custom-qrcode.png');
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR Code (PNG)</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. MEME GENERATOR */}
      {activeSubTool === 'meme' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center p-4">
            {memePreviewUrl ? (
              <img src={memePreviewUrl} alt="Meme preview" className="max-h-full max-w-full object-contain rounded shadow" />
            ) : (
              <span className="text-xs text-slate-400">Generating meme...</span>
            )}
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Classic Meme Generator
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Top Caption</label>
              <input
                type="text"
                value={memeTop}
                onChange={(e) => setMemeTop(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold uppercase"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Bottom Caption</label>
              <input
                type="text"
                value={memeBottom}
                onChange={(e) => setMemeBottom(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold uppercase"
              />
            </div>

            <button
              onClick={() => {
                if (memePreviewUrl) {
                  downloadFile(memePreviewUrl, 'viral-meme.jpg');
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Meme (JPG)</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. EXIF METADATA & PRIVACY STRIPPER */}
      {activeSubTool === 'metadata' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Image Metadata & Privacy Inspector</h3>
              <p className="text-xs text-slate-500">
                Inspect intrinsic image properties and remove sensitive GPS locations, camera serials, and timestamps with 1 click.
              </p>
            </div>
            <button
              onClick={handleDownloadCleanImage}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Strip All Metadata & Download Clean Image</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">File Name</span>
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate block mt-0.5">{currentFile?.name}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dimensions</span>
              <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 block mt-0.5">
                {currentFile?.originalWidth} × {currentFile?.originalHeight} px
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">File Size</span>
              <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 block mt-0.5">
                {formatBytes(currentFile?.originalSize || 0)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MIME Type</span>
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200 block mt-0.5">
                {currentFile?.file.type || 'image/jpeg'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. COLLAGE MAKER */}
      {activeSubTool === 'collage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-checkerboard h-[450px] flex items-center justify-center p-4">
            {collagePreviewUrl ? (
              <img src={collagePreviewUrl} alt="Collage preview" className="max-h-full max-w-full object-contain rounded shadow" />
            ) : (
              <span className="text-xs text-slate-400">Loading collage...</span>
            )}
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Collage Layout Settings
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'grid-2x2', label: '2×2 Square Grid' },
                { id: 'horizontal-2', label: '2 Column Side-by-Side' },
                { id: 'vertical-2', label: '2 Row Stack' },
                { id: 'trio-1-2', label: '1 Large + 2 Small' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setCollageLayout(l.id as any)}
                  className={`p-2 rounded-xl border text-center font-medium ${
                    collageLayout === l.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Border Gap</span>
                <span className="font-mono font-bold text-indigo-600">{collageSpacing}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={collageSpacing}
                onChange={(e) => setCollageSpacing(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                if (collagePreviewUrl) {
                  downloadFile(collagePreviewUrl, 'photo-collage.jpg');
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Collage (JPG)</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. FAVICON GENERATOR */}
      {activeSubTool === 'favicon' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Favicon & App Icon Generator</h3>
            <p className="text-xs text-slate-500">
              Generate crisp standard browser tab icons and mobile bookmark assets from your image with 1 click.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[16, 32, 48, 180, 512].map((sz) => (
              <div key={sz} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                <img
                  src={currentFile?.previewUrl}
                  alt="icon"
                  className="rounded object-cover"
                  style={{ width: Math.min(64, sz), height: Math.min(64, sz) }}
                />
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{sz}×{sz}</span>
                <span className="text-[10px] text-slate-400">
                  {sz === 16 ? 'Browser Tab' : sz === 32 ? 'Retina Tab' : sz === 48 ? 'Desktop' : sz === 180 ? 'Apple Touch' : 'PWA Store'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleDownloadFaviconSet}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download All Icon Sizes (PNG Package)</span>
          </button>
        </div>
      )}
    </div>
  );
};
