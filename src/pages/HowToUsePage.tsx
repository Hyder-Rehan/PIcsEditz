import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Minimize2, Maximize2, RefreshCw, Scissors, Camera, Sliders, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowToUsePageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
  onLaunchTool: (toolId: string) => void;
}

export const HowToUsePage: React.FC<HowToUsePageProps> = ({
  onNavigateHome,
  onNavigatePage,
  onLaunchTool,
}) => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="How to Use Our Image Tools"
        subtitle="Step-by-step tutorials to help you compress, resize, convert, edit, and format photos with maximum precision."
        category="Tutorials & Guides"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Guide 1: Image Compression */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Minimize2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  1. How to Compress an Image
                </h2>
                <span className="text-xs text-slate-500">Reduce file size while preserving visual clarity</span>
              </div>
            </div>
            <button
              onClick={() => onLaunchTool('compress')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 1:</span>
              <span>Drag and drop your image into the compressor box or click browse to upload JPG, PNG, or WebP files.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 2:</span>
              <span>
                Choose your compression method:
                <br />• <strong>Quality Slider:</strong> Slide between 5% and 100% (80% is the recommended sweet spot for web).
                <br />• <strong>Target Max Size:</strong> Set an exact KB budget (e.g., 100 KB, 150 KB, or 200 KB). Our binary search engine will iterate to find the optimal quality factor.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 3:</span>
              <span>Inspect the output with the <strong>Split Slider Comparator</strong>. Drag the divider handle left and right to verify text sharpness and edge definition.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 4:</span>
              <span>Click <strong>Download Compressed</strong> to save your file.</span>
            </div>
          </div>
        </section>

        {/* Guide 2: Image Resizer */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  2. How to Resize an Image
                </h2>
                <span className="text-xs text-slate-500">Scale dimensions with aspect ratio protection</span>
              </div>
            </div>
            <button
              onClick={() => onLaunchTool('resize')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 1:</span>
              <span>Upload your photo into the Resizer. The current dimensions will be shown automatically.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 2:</span>
              <span>
                Enter your target Width or Height in pixels. Keep the <strong>Lock Aspect Ratio</strong> toggle turned ON (indigo lock) so the corresponding dimension adjusts proportionally to prevent stretching.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 3:</span>
              <span>
                Alternatively, pick a verified preset (such as Instagram Square 1080x1080, YouTube Thumbnail 1280x720, or LinkedIn Banner 1584x396) or select a percentage button (50%, 75%, 200%).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 4:</span>
              <span>Select your fit strategy: <strong>Cover / Crop</strong> fills the bounding box cleanly, while <strong>Contain / Pad</strong> adds a custom colored background border.</span>
            </div>
          </div>
        </section>

        {/* Guide 3: Format Converter */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  3. How to Convert Image Formats
                </h2>
                <span className="text-xs text-slate-500">Fast conversion between WebP, PNG, JPG, and AVIF</span>
              </div>
            </div>
            <button
              onClick={() => onLaunchTool('convert')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 1:</span>
              <span>Select the Image Format Converter and load your source image.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 2:</span>
              <span>Choose your target output format: <strong>WebP</strong> for modern web delivery, <strong>PNG</strong> for lossless transparency, or <strong>JPG</strong> for universal compatibility.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 3:</span>
              <span>
                <strong>Handling Transparency:</strong> If you are converting a transparent PNG/WebP to JPG, the JPEG specification does not support transparency. Use our color picker to select an elegant matte fill (default white).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 4:</span>
              <span>Review the live converted preview and file size, then click Download.</span>
            </div>
          </div>
        </section>

        {/* Guide 4: Background Remover & Changer */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  4. How to Remove or Replace Backgrounds
                </h2>
                <span className="text-xs text-slate-500">Segment subjects and composite studio colors</span>
              </div>
            </div>
            <button
              onClick={() => onLaunchTool('background')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 1:</span>
              <span>Upload a portrait or product photo. The tool immediately executes our multi-corner edge keying algorithm.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 2:</span>
              <span>
                Fine-tune the <strong>Color Sensitivity / Tolerance</strong> slider to expand or contract background separation. Use the <strong>Eraser Brush</strong> tool to manually touch up any stray background areas directly on the canvas.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 3:</span>
              <span>
                Select your backdrop:
                <br />• <strong>Transparent:</strong> Export as transparent PNG.
                <br />• <strong>Solid Color:</strong> Choose Passport White, Visa Blue, or custom Hex.
                <br />• <strong>Gradient:</strong> Apply studio linear gradients (Cyber Indigo, Sunset, Executive).
                <br />• <strong>Custom Pic:</strong> Upload an office scene, nature wallpaper, or desk backdrop.
              </span>
            </div>
          </div>
        </section>

        {/* Guide 5: Passport Photo Maker */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  5. How to Make Biometric Passport Photos
                </h2>
                <span className="text-xs text-slate-500">Official country specifications & printable 4x6&quot; sheets</span>
              </div>
            </div>
            <button
              onClick={() => onLaunchTool('passport')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 1:</span>
              <span>Upload a well-lit, front-facing portrait photo looking directly at the camera with a neutral expression.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 2:</span>
              <span>
                Select your destination country specification: US Passport (2x2&quot;), UK/EU Schengen (35x45mm), India (35x45mm or 2x2&quot;), Canada (50x70mm), or Australia.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 3:</span>
              <span>
                Activate the <strong>Biometric Face Guide Overlay</strong>. Adjust the Zoom slider and Pan controls so the subject&apos;s eyes align with the Eye Level guide and the chin rests on the Chin Line.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 shrink-0">Step 4:</span>
              <span>
                Choose your layout: Download a single high-resolution photo, or choose <strong>Printable 4x6&quot; Sheet</strong> (4, 6, or 8 copies with cut guidelines) to print at home or any photo kiosk.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
