import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { ImageAdjustments, TextOverlay } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = url;
  });
}

export function loadImageFromFile(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, objectUrl });
    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to read image file: ' + e));
    };
    img.src = objectUrl;
  });
}

export function getMimeType(format: string): string {
  const f = format.toLowerCase().trim();
  switch (f) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'bmp':
      return 'image/bmp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

export function isFormatSupported(mimeType: string): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const dataUrl = canvas.toDataURL(mimeType);
  return dataUrl.startsWith(`data:${mimeType}`);
}

/**
 * Compress an image canvas with specified format and quality.
 * If targetSizeBytes is provided, performs binary search to find closest quality.
 */
export async function compressCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: string = 'webp',
  quality: number = 0.8,
  targetSizeBytes?: number,
  fillBackgroundForOpaque: string = '#ffffff'
): Promise<{ blob: Blob; url: string; finalQuality: number; warning?: string }> {
  const mime = getMimeType(format);

  // If format doesn't support alpha (like JPEG), render onto a filled canvas
  let sourceCanvas = canvas;
  if (mime === 'image/jpeg') {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    const ctx = bgCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = fillBackgroundForOpaque;
      ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(canvas, 0, 0);
      sourceCanvas = bgCanvas;
    }
  }

  // Helper to test quality
  const getBlobForQuality = (q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      sourceCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas toBlob failed'));
        },
        mime,
        q
      );
    });
  };

  if (!targetSizeBytes || mime === 'image/png') {
    // Standard compression (PNG does not support quality param in standard toBlob, uses lossless)
    const blob = await getBlobForQuality(quality);
    const url = URL.createObjectURL(blob);
    return { blob, url, finalQuality: quality };
  }

  // Binary search for target file size
  let low = 0.05;
  let high = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = quality;

  for (let iter = 0; iter < 6; iter++) {
    const mid = (low + high) / 2;
    const currentBlob = await getBlobForQuality(mid);

    if (currentBlob.size <= targetSizeBytes) {
      bestBlob = currentBlob;
      bestQuality = mid;
      low = mid; // Try for higher quality within budget
    } else {
      high = mid; // Needs more compression
    }
  }

  let warning: string | undefined;
  if (!bestBlob) {
    // Even at lowest quality, target size couldn't be met
    bestBlob = await getBlobForQuality(0.05);
    bestQuality = 0.05;
    warning = `Target size (${formatBytes(targetSizeBytes)}) is too small for this resolution. Compressed to lowest possible quality (${formatBytes(bestBlob.size)}). Consider reducing dimensions in Image Resizer.`;
  }

  const url = URL.createObjectURL(bestBlob);
  return { blob: bestBlob, url, finalQuality: bestQuality, warning };
}

/**
 * Resizes an image with aspect ratio and various fit modes
 */
export function resizeImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  fitMode: 'fill' | 'contain' | 'cover' = 'fill',
  bgColor: string = '#ffffff'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (fitMode === 'contain') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  } else if (fitMode === 'cover') {
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  } else {
    // Fill / stretch exactly to target
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

/**
 * Client-Side Smart Background Removal & Replacement
 * Analyzes color similarity, border chrominance, and smart edge mask
 */
export function removeBackgroundCanvas(
  sourceCanvas: HTMLCanvasElement,
  tolerance: number = 30, // 0 - 100
  featherRadius: number = 2,
  sampleColor?: { r: number; g: number; b: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;

  // Determine key background color if not passed (samples corners)
  let bgR = 255, bgG = 255, bgB = 255;
  if (sampleColor) {
    bgR = sampleColor.r;
    bgG = sampleColor.g;
    bgB = sampleColor.b;
  } else {
    // Sample top-left, top-right, bottom-left, bottom-right
    const corners = [
      0, // top-left
      (w - 1) * 4, // top-right
      ((h - 1) * w) * 4, // bottom-left
      ((h - 1) * w + (w - 1)) * 4 // bottom-right
    ];
    let sumR = 0, sumG = 0, sumB = 0;
    for (const idx of corners) {
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
    }
    bgR = Math.round(sumR / 4);
    bgG = Math.round(sumG / 4);
    bgB = Math.round(sumB / 4);
  }

  const tolDistSq = (tolerance * 4.4) * (tolerance * 4.4); // max ~440 Euclidean color dist
  const mask = new Uint8Array(w * h);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dr = r - bgR;
    const dg = g - bgG;
    const db = b - bgB;
    const distSq = dr * dr + dg * dg + db * db;

    const pixelIdx = i / 4;
    if (distSq < tolDistSq) {
      mask[pixelIdx] = 0; // background
    } else {
      mask[pixelIdx] = 255; // foreground
    }
  }

  // Apply feather / alpha gradient to avoid jagged pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const pixelOffset = idx * 4;

      if (mask[idx] === 0) {
        data[pixelOffset + 3] = 0; // Transparent
      } else if (featherRadius > 0) {
        // Simple edge smoothing
        let neighborBgs = 0;
        let checks = 0;
        for (let dy = -featherRadius; dy <= featherRadius; dy++) {
          for (let dx = -featherRadius; dx <= featherRadius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              checks++;
              if (mask[ny * w + nx] === 0) neighborBgs++;
            }
          }
        }
        if (neighborBgs > 0) {
          const ratio = 1 - (neighborBgs / checks);
          data[pixelOffset + 3] = Math.round(data[pixelOffset + 3] * Math.max(0.1, ratio));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Composite transparent foreground canvas over a custom background (solid, gradient, or image)
 */
export function compositeBackground(
  fgCanvas: HTMLCanvasElement,
  bgType: 'transparent' | 'solid' | 'gradient' | 'image',
  bgOptions: {
    solidColor?: string;
    gradient?: { type: 'linear' | 'radial'; color1: string; color2: string; angle?: number };
    bgImage?: HTMLImageElement;
  }
): HTMLCanvasElement {
  const result = document.createElement('canvas');
  result.width = fgCanvas.width;
  result.height = fgCanvas.height;
  const ctx = result.getContext('2d');
  if (!ctx) return result;

  if (bgType === 'solid') {
    ctx.fillStyle = bgOptions.solidColor || '#ffffff';
    ctx.fillRect(0, 0, result.width, result.height);
  } else if (bgType === 'gradient' && bgOptions.gradient) {
    const { color1, color2, angle = 135 } = bgOptions.gradient;
    const rad = (angle * Math.PI) / 180;
    const x1 = Math.cos(rad) < 0 ? result.width : 0;
    const y1 = Math.sin(rad) < 0 ? result.height : 0;
    const x2 = result.width - x1;
    const y2 = result.height - y1;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, result.width, result.height);
  } else if (bgType === 'image' && bgOptions.bgImage) {
    // Fill/Cover the background
    const scale = Math.max(result.width / bgOptions.bgImage.width, result.height / bgOptions.bgImage.height);
    const w = bgOptions.bgImage.width * scale;
    const h = bgOptions.bgImage.height * scale;
    const x = (result.width - w) / 2;
    const y = (result.height - h) / 2;
    ctx.drawImage(bgOptions.bgImage, x, y, w, h);
  }

  // Draw transparent foreground on top
  ctx.drawImage(fgCanvas, 0, 0);
  return result;
}

/**
 * Full Image Editor rendering with filters, transformations, text overlays, frames
 */
export function renderEditedImage(
  img: HTMLImageElement,
  adjustments: ImageAdjustments,
  cropRect?: { x: number; y: number; width: number; height: number },
  overlays: TextOverlay[] = [],
  frame?: { borderWidth: number; borderColor: string; borderRadius: number; vignette: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');

  // Determine base width & height from crop or full image
  const baseWidth = cropRect ? cropRect.width : img.width;
  const baseHeight = cropRect ? cropRect.height : img.height;

  const is90or270 = adjustments.rotation === 90 || adjustments.rotation === 270;
  canvas.width = is90or270 ? baseHeight : baseWidth;
  canvas.height = is90or270 ? baseWidth : baseHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();

  // Apply filters via CSS filter string
  const filters: string[] = [];
  if (adjustments.brightness !== 0) filters.push(`brightness(${100 + adjustments.brightness}%)`);
  if (adjustments.contrast !== 0) filters.push(`contrast(${100 + adjustments.contrast}%)`);
  if (adjustments.saturation !== 0) filters.push(`saturate(${100 + adjustments.saturation}%)`);
  if (adjustments.sepia > 0) filters.push(`sepia(${adjustments.sepia}%)`);
  if (adjustments.grayscale > 0) filters.push(`grayscale(${adjustments.grayscale}%)`);
  if (adjustments.invert > 0) filters.push(`invert(${adjustments.invert}%)`);
  if (adjustments.blur > 0) filters.push(`blur(${adjustments.blur}px)`);

  if (filters.length > 0) {
    ctx.filter = filters.join(' ');
  }

  // Center coordinate system for rotation and flipping
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Rotation
  if (adjustments.rotation !== 0) {
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
  }

  // Flip
  const scaleX = adjustments.flipH ? -1 : 1;
  const scaleY = adjustments.flipV ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Draw image (with crop source if present)
  if (cropRect) {
    ctx.drawImage(
      img,
      cropRect.x, cropRect.y, cropRect.width, cropRect.height,
      -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight
    );
  } else {
    ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
  }

  ctx.restore();

  // Draw Vignette if configured
  if (frame && frame.vignette > 0) {
    const radius = Math.max(canvas.width, canvas.height) / 2;
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, radius * 0.4,
      canvas.width / 2, canvas.height / 2, radius
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${frame.vignette / 100})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw Border/Frame if configured
  if (frame && frame.borderWidth > 0) {
    ctx.lineWidth = frame.borderWidth;
    ctx.strokeStyle = frame.borderColor;
    ctx.strokeRect(
      frame.borderWidth / 2,
      frame.borderWidth / 2,
      canvas.width - frame.borderWidth,
      canvas.height - frame.borderWidth
    );
  }

  // Draw Text Overlays
  for (const overlay of overlays) {
    if (!overlay.text.trim()) continue;
    ctx.save();
    const x = (overlay.x / 100) * canvas.width;
    const y = (overlay.y / 100) * canvas.height;
    ctx.font = `${overlay.bold ? 'bold ' : ''}${overlay.fontSize}px ${overlay.fontFamily || 'Plus Jakarta Sans'}, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(overlay.text);
    const textWidth = metrics.width;
    const textHeight = overlay.fontSize * 1.2;

    if (overlay.bgColor && overlay.bgColor !== 'transparent') {
      ctx.fillStyle = overlay.bgColor;
      ctx.fillRect(x - textWidth / 2 - 12, y - textHeight / 2 - 4, textWidth + 24, textHeight + 8);
    }

    if (overlay.outline) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(2, overlay.fontSize / 8);
      ctx.strokeText(overlay.text, x, y);
    }

    ctx.fillStyle = overlay.color;
    ctx.fillText(overlay.text, x, y);
    ctx.restore();
  }

  return canvas;
}

/**
 * Passport Photo Generator
 * Generates single compliant photo or 4x6 inch printable multi-photo sheet
 */
export function generatePassportPhoto(
  img: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  targetWidthPx: number,
  targetHeightPx: number,
  bgColor: string = '#ffffff',
  mode: 'single' | 'sheet_4x6' = 'single',
  copiesOnSheet: number = 6
): HTMLCanvasElement {
  // First, create the single cropped & scaled passport photo
  const singleCanvas = document.createElement('canvas');
  singleCanvas.width = targetWidthPx;
  singleCanvas.height = targetHeightPx;
  const sCtx = singleCanvas.getContext('2d');
  if (!sCtx) return singleCanvas;

  // Background
  sCtx.fillStyle = bgColor;
  sCtx.fillRect(0, 0, targetWidthPx, targetHeightPx);

  // Draw cropped subject
  sCtx.drawImage(
    img,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, targetWidthPx, targetHeightPx
  );

  if (mode === 'single') {
    return singleCanvas;
  }

  // Printable 4x6 inch sheet at 300 DPI = 1200 x 1800 px (or 1800 x 1200 landscape)
  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = 1800; // 6 inches @ 300 dpi
  sheetCanvas.height = 1200; // 4 inches @ 300 dpi
  const ctx = sheetCanvas.getContext('2d');
  if (!ctx) return singleCanvas;

  // White paper base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

  // Layout calculations
  const cols = copiesOnSheet === 4 ? 2 : copiesOnSheet === 6 ? 3 : 4;
  const rows = Math.ceil(copiesOnSheet / cols);

  // Scale photo if necessary to fit nicely on 4x6 with margins
  const maxSlotW = (sheetCanvas.width - 160) / cols;
  const maxSlotH = (sheetCanvas.height - 160) / rows;
  const scale = Math.min(1, Math.min(maxSlotW / targetWidthPx, maxSlotH / targetHeightPx));
  const photoW = targetWidthPx * scale;
  const photoH = targetHeightPx * scale;

  const gapX = (sheetCanvas.width - (cols * photoW)) / (cols + 1);
  const gapY = (sheetCanvas.height - (rows * photoH)) / (rows + 1);

  let placed = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (placed >= copiesOnSheet) break;
      const x = gapX + c * (photoW + gapX);
      const y = gapY + r * (photoH + gapY);

      // Draw photo
      ctx.drawImage(singleCanvas, x, y, photoW, photoH);

      // Subtle cutting guide line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x - 2, y - 2, photoW + 4, photoH + 4);
      ctx.setLineDash([]);

      placed++;
    }
  }

  // Subtle footer note for printing
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OptiPixel Biometric Passport Sheet · 4x6" (10x15cm) at 300 DPI · Cut along dashed guides', sheetCanvas.width / 2, sheetCanvas.height - 18);

  return sheetCanvas;
}

/**
 * Image to PDF Generator
 */
export async function convertImagesToPdf(
  images: { canvas: HTMLCanvasElement; name: string }[],
  pageSize: 'a4' | 'letter' = 'a4',
  orientation: 'p' | 'l' = 'p',
  marginMm: number = 10
): Promise<Blob> {
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const printableW = pageWidth - marginMm * 2;
  const printableH = pageHeight - marginMm * 2;

  images.forEach((item, index) => {
    if (index > 0) {
      doc.addPage(pageSize, orientation);
    }

    const imgData = item.canvas.toDataURL('image/jpeg', 0.95);
    const imgRatio = item.canvas.width / item.canvas.height;
    const pageRatio = printableW / printableH;

    let w = printableW;
    let h = printableH;

    if (imgRatio > pageRatio) {
      h = printableW / imgRatio;
    } else {
      w = printableH * imgRatio;
    }

    const x = marginMm + (printableW - w) / 2;
    const y = marginMm + (printableH - h) / 2;

    doc.addImage(imgData, 'JPEG', x, y, w, h);
  });

  return doc.output('blob');
}

/**
 * Generate QR Code onto a canvas with custom styling
 */
export async function generateQrCodeCanvas(
  text: string,
  options: {
    width?: number;
    colorDark?: string;
    colorLight?: string;
    logoImage?: HTMLImageElement;
  }
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, {
    width: options.width || 512,
    margin: 2,
    color: {
      dark: options.colorDark || '#000000',
      light: options.colorLight || '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  // If center logo provided, draw in center
  if (options.logoImage) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const logoSize = canvas.width * 0.22;
      const lx = (canvas.width - logoSize) / 2;
      const ly = (canvas.height - logoSize) / 2;

      // Logo background badge
      ctx.fillStyle = options.colorLight || '#ffffff';
      ctx.beginPath();
      ctx.roundRect(lx - 6, ly - 6, logoSize + 12, logoSize + 12, 8);
      ctx.fill();
      ctx.drawImage(options.logoImage, lx, ly, logoSize, logoSize);
    }
  }

  return canvas;
}

/**
 * Watermark an image (text or logo)
 */
export function applyWatermark(
  img: HTMLImageElement,
  type: 'text' | 'logo',
  options: {
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    opacity?: number;
    position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'tiled';
    logoImage?: HTMLImageElement;
    logoScale?: number;
  }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0);

  const opacity = options.opacity ?? 0.5;
  ctx.globalAlpha = opacity;

  if (type === 'text') {
    const text = options.text || 'OptiPixel Watermark';
    const fontSize = options.fontSize || Math.max(18, Math.round(canvas.width / 24));
    ctx.font = `bold ${fontSize}px ${options.fontFamily || 'Plus Jakarta Sans'}, sans-serif`;
    ctx.fillStyle = options.color || '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;

    if (options.position === 'tiled') {
      const metrics = ctx.measureText(text);
      const stepX = metrics.width + 120;
      const stepY = fontSize * 3.5;
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    } else {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      ctx.textAlign = 'center';

      if (options.position === 'bottom-right') {
        ctx.textAlign = 'right';
        x = canvas.width - 32;
        y = canvas.height - 32;
      } else if (options.position === 'bottom-left') {
        ctx.textAlign = 'left';
        x = 32;
        y = canvas.height - 32;
      } else if (options.position === 'top-right') {
        ctx.textAlign = 'right';
        x = canvas.width - 32;
        y = fontSize + 32;
      }
      ctx.fillText(text, x, y);
    }
  } else if (type === 'logo' && options.logoImage) {
    const scale = (options.logoScale || 20) / 100;
    const logoW = canvas.width * scale;
    const logoH = (logoW / options.logoImage.width) * options.logoImage.height;

    let x = (canvas.width - logoW) / 2;
    let y = (canvas.height - logoH) / 2;

    if (options.position === 'bottom-right') {
      x = canvas.width - logoW - 32;
      y = canvas.height - logoH - 32;
    } else if (options.position === 'bottom-left') {
      x = 32;
      y = canvas.height - logoH - 32;
    } else if (options.position === 'top-right') {
      x = canvas.width - logoW - 32;
      y = 32;
    }

    ctx.drawImage(options.logoImage, x, y, logoW, logoH);
  }

  ctx.globalAlpha = 1.0;
  return canvas;
}

/**
 * Extract dominant color palette from image canvas
 */
export function extractColorPalette(canvas: HTMLCanvasElement, colorCount = 6): { hex: string; rgb: string; count: number }[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // Sample down to 100x100 for high speed
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 100;
  sampleCanvas.height = 100;
  const sCtx = sampleCanvas.getContext('2d');
  if (!sCtx) return [];
  sCtx.drawImage(canvas, 0, 0, 100, 100);

  const imgData = sCtx.getImageData(0, 0, 100, 100).data;
  const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();

  // Quantize colors to reduce variance
  for (let i = 0; i < imgData.length; i += 4) {
    const a = imgData[i + 3];
    if (a < 128) continue; // skip transparent

    const r = Math.round(imgData[i] / 24) * 24;
    const g = Math.round(imgData[i + 1] / 24) * 24;
    const b = Math.round(imgData[i + 2] / 24) * 24;
    const key = `${r},${g},${b}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }
  }

  const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  return sorted.slice(0, colorCount).map((c) => {
    const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
    const hex = `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase();
    return {
      hex,
      rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
      count: c.count
    };
  });
}

/**
 * Classic Meme Generator with stroke and Impact font
 */
export function generateMemeCanvas(
  img: HTMLImageElement,
  topText: string,
  bottomText: string,
  fontSizeRatio = 0.08
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0);

  const fontSize = Math.max(24, Math.round(canvas.width * fontSizeRatio));
  ctx.font = `900 ${fontSize}px Impact, "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(3, fontSize / 7);
  ctx.lineJoin = 'round';

  const drawCaption = (text: string, y: number) => {
    if (!text.trim()) return;
    const upper = text.toUpperCase();
    ctx.strokeText(upper, canvas.width / 2, y);
    ctx.fillText(upper, canvas.width / 2, y);
  };

  if (topText) {
    ctx.textBaseline = 'top';
    drawCaption(topText, fontSize * 0.4);
  }

  if (bottomText) {
    ctx.textBaseline = 'bottom';
    drawCaption(bottomText, canvas.height - fontSize * 0.4);
  }

  return canvas;
}

/**
 * Image Collage Maker
 */
export function createCollageCanvas(
  images: HTMLImageElement[],
  layout: 'grid-2x2' | 'horizontal-2' | 'vertical-2' | 'trio-1-2' | 'grid-3x2',
  spacing = 12,
  bgColor = '#ffffff',
  targetW = 1200,
  targetH = 1200
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawFitted = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  if (layout === 'horizontal-2' && images.length >= 2) {
    const w = (targetW - spacing * 3) / 2;
    const h = targetH - spacing * 2;
    drawFitted(images[0], spacing, spacing, w, h);
    drawFitted(images[1], spacing * 2 + w, spacing, w, h);
  } else if (layout === 'vertical-2' && images.length >= 2) {
    const w = targetW - spacing * 2;
    const h = (targetH - spacing * 3) / 2;
    drawFitted(images[0], spacing, spacing, w, h);
    drawFitted(images[1], spacing, spacing * 2 + h, w, h);
  } else if (layout === 'trio-1-2' && images.length >= 3) {
    const leftW = (targetW - spacing * 3) / 2;
    const leftH = targetH - spacing * 2;
    drawFitted(images[0], spacing, spacing, leftW, leftH);

    const rightW = leftW;
    const rightH = (targetH - spacing * 3) / 2;
    drawFitted(images[1], spacing * 2 + leftW, spacing, rightW, rightH);
    drawFitted(images[2], spacing * 2 + leftW, spacing * 2 + rightH, rightW, rightH);
  } else {
    // Default 2x2 grid
    const cellW = (targetW - spacing * 3) / 2;
    const cellH = (targetH - spacing * 3) / 2;
    const slots = [
      { x: spacing, y: spacing },
      { x: spacing * 2 + cellW, y: spacing },
      { x: spacing, y: spacing * 2 + cellH },
      { x: spacing * 2 + cellW, y: spacing * 2 + cellH }
    ];

    images.slice(0, 4).forEach((img, i) => {
      const slot = slots[i];
      if (slot) drawFitted(img, slot.x, slot.y, cellW, cellH);
    });
  }

  return canvas;
}

/**
 * Trigger file download helper
 */
export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
