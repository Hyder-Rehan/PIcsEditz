export type ToolId = 
  | 'compress'
  | 'resize'
  | 'convert'
  | 'background'
  | 'editor'
  | 'passport'
  | 'pdf'
  | 'watermark'
  | 'color-picker'
  | 'qr-code'
  | 'meme'
  | 'metadata'
  | 'collage'
  | 'favicon'
  | 'bulk';

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  processedUrl?: string;
  processedSize?: number;
  processedWidth?: number;
  processedHeight?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  format?: string;
}

export interface DimensionPreset {
  name: string;
  category: string;
  width: number;
  height: number;
  description: string;
}

export interface PassportPreset {
  country: string;
  name: string;
  widthMm: number;
  heightMm: number;
  widthInches: number;
  heightInches: number;
  dpi: number;
  bgColor: string;
  notes: string;
}

export interface ImageAdjustments {
  brightness: number; // -100 to 100 (0 default)
  contrast: number;   // -100 to 100 (0 default)
  saturation: number; // -100 to 100 (0 default)
  exposure: number;   // -100 to 100 (0 default)
  blur: number;       // 0 to 20
  sepia: number;      // 0 to 100
  grayscale: number;  // 0 to 100
  invert: number;     // 0 to 100
  sharpness: number;  // 0 to 100
  rotation: number;   // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number; // % from left
  y: number; // % from top
  fontSize: number;
  color: string;
  bgColor: string;
  fontFamily: string;
  bold: boolean;
  outline: boolean;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'passport' | 'profile' | 'ecommerce' | 'social' | 'youtube' | 'banner';
  description: string;
  recommendedTool: ToolId;
  aspectRatio: string;
  presetDimensions?: { width: number; height: number };
  sampleImageUrl: string;
}
