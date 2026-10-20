import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Minimize2,
  Maximize2,
  RefreshCw,
  Scissors,
  Sliders,
  Camera,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ImageFileItem, TemplateItem, ToolId } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AdPlacement } from './components/AdPlacement';
import { CompressorTool } from './components/tools/CompressorTool';
import { ResizerTool } from './components/tools/ResizerTool';
import { ConverterTool } from './components/tools/ConverterTool';
import { BackgroundTool } from './components/tools/BackgroundTool';
import { EditorTool } from './components/tools/EditorTool';
import { PassportPhotoTool } from './components/tools/PassportPhotoTool';
import { AdditionalTools } from './components/tools/AdditionalTools';
import { TemplatesLibrary } from './components/TemplatesLibrary';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { CookieBanner, LegalModals } from './components/LegalModals';
import { SAMPLE_ASSETS } from './data/presets';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('compress');
  const [hasLoadedFiles, setHasLoadedFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<ImageFileItem[]>([]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('optipixel-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'contact' | 'docs' | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('optipixel-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('optipixel-theme', 'light');
    }
  }, [isDark]);

  // Load files from FileList or File array
  const handleFilesSelected = async (fileList: FileList | File[], initialTool?: ToolId) => {
    const rawFiles = Array.from(fileList);
    const newItems: ImageFileItem[] = [];

    for (const f of rawFiles) {
      const objUrl = URL.createObjectURL(f);
      const img = new Image();
      await new Promise((res) => {
        img.onload = res;
        img.onerror = res;
        img.src = objUrl;
      });

      newItems.push({
        id: 'file-' + Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        originalSize: f.size,
        originalWidth: img.width || 1200,
        originalHeight: img.height || 800,
        previewUrl: objUrl,
        status: 'idle',
      });
    }

    if (newItems.length > 0) {
      setFiles(newItems);
      setHasLoadedFiles(true);
      if (initialTool) {
        setActiveTool(initialTool);
      }
      // Smooth scroll to tool workspace
      setTimeout(() => {
        document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Load sample file helper
  const handleLoadSample = async (sampleUrl: string, sampleName: string, initialTool?: ToolId) => {
    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      await handleFilesSelected([file], initialTool);
    } catch (e) {
      console.error('Failed to load sample image', e);
    }
  };

  const handleUpdateFile = (id: string, updates: Partial<ImageFileItem>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Launch from template card
  const handleSelectTemplate = (template: TemplateItem) => {
    handleLoadSample(template.sampleImageUrl, `${template.id}.jpg`, template.recommendedTool);
  };

  const allTools: { id: ToolId; name: string; icon: any; desc: string }[] = [
    { id: 'compress', name: 'Compressor', icon: Minimize2, desc: 'Shrink file size up to 85%' },
    { id: 'resize', name: 'Resizer', icon: Maximize2, desc: 'Dimensions & Aspect lock' },
    { id: 'convert', name: 'Converter', icon: RefreshCw, desc: 'WebP, PNG, JPG, AVIF' },
    { id: 'background', name: 'Background', icon: Scissors, desc: 'Remover & Studio changer' },
    { id: 'editor', name: 'Editor', icon: Sliders, desc: 'Filters, Crop & Text' },
    { id: 'passport', name: 'Passport Photo', icon: Camera, desc: 'Biometric 4x6" print sheets' },
    { id: 'pdf', name: 'PDF & More', icon: Layers, desc: 'PDF, QR, Watermark & Collage' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Header */}
      <Navbar
        activeTool={hasLoadedFiles ? activeTool : null}
        onSelectTool={(tool) => {
          setActiveTool(tool);
          if (!hasLoadedFiles) {
            handleLoadSample(SAMPLE_ASSETS.landscape, 'demo_landscape.jpg', tool);
          }
        }}
        onResetToHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenUpload={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = (e: any) => {
            if (e.target.files) handleFilesSelected(e.target.files);
          };
          input.click();
        }}
        onOpenLegal={(type) => setLegalModal(type)}
      />

      <main className="flex-1">
        {/* Hero Section with Drag & Drop Zone */}
        <Hero
          onFilesSelected={(fileList, initialTool) => handleFilesSelected(fileList, initialTool)}
          onLoadSample={handleLoadSample}
        />

        {/* AdSense Top Leaderboard */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdPlacement slotType="horizontal-leaderboard" />
        </div>

        {/* WORKSPACE AREA (When files loaded or tool active) */}
        <section id="workspace" className="py-12 border-b border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tool Selection Tabs Bar */}
            <div id="tools" className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Toolkit Dashboard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Switch between specialized image manipulation engines with your active image:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900 rounded-2xl">
                {allTools.map((t) => {
                  const Icon = t.icon;
                  const isSelected = activeTool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTool(t.id);
                        if (!hasLoadedFiles) {
                          // Auto load appropriate sample so user sees live tool in action
                          const sample = t.id === 'passport' ? SAMPLE_ASSETS.portrait : t.id === 'background' ? SAMPLE_ASSETS.product : SAMPLE_ASSETS.landscape;
                          handleLoadSample(sample, `demo_${t.id}.jpg`, t.id);
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all text-center ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-md shadow-slate-200/50 dark:shadow-none'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs whitespace-nowrap">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tool Viewport */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-sm">
              {files.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to process your images</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Upload your image or pick a demo asset from above to instantly use the {allTools.find(t => t.id === activeTool)?.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => handleLoadSample(SAMPLE_ASSETS.landscape, 'sample_landscape.jpg', activeTool)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <span>Load Demo Photo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {activeTool === 'compress' && (
                    <CompressorTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.landscape, 'scenic_photo.jpg', 'compress')}
                    />
                  )}

                  {activeTool === 'resize' && (
                    <ResizerTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.landscape, 'scenic_photo.jpg', 'resize')}
                    />
                  )}

                  {activeTool === 'convert' && (
                    <ConverterTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.product, 'product_photo.jpg', 'convert')}
                    />
                  )}

                  {activeTool === 'background' && (
                    <BackgroundTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.product, 'product_photo.jpg', 'background')}
                    />
                  )}

                  {activeTool === 'editor' && (
                    <EditorTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.banner, 'banner_scene.jpg', 'editor')}
                    />
                  )}

                  {activeTool === 'passport' && (
                    <PassportPhotoTool
                      files={files}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.portrait, 'id_portrait.jpg', 'passport')}
                    />
                  )}

                  {['pdf', 'watermark', 'color-picker', 'qr-code', 'meme', 'metadata', 'collage', 'favicon', 'bulk'].includes(activeTool) && (
                    <AdditionalTools
                      files={files}
                      activeSubTool={activeTool}
                      onSelectSubTool={(sub) => setActiveTool(sub)}
                      onUpdateFile={handleUpdateFile}
                      onSelectAnother={() => handleLoadSample(SAMPLE_ASSETS.landscape, 'sample_photo.jpg', activeTool)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <TemplatesLibrary onSelectTemplate={handleSelectTemplate} />

        {/* AdSense Mid-Page Rectangle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdPlacement slotType="medium-rectangle" />
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-base">OptiPixel</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The all-in-one client-side browser image toolkit. High speed, zero server uploads, 100% private.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Core Tools
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => { setActiveTool('compress'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Image Compressor
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('resize'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Image Resizer
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('convert'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Format Converter
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('background'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Background Remover
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Biometric & Utility
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => { setActiveTool('passport'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Passport Photo Maker
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('pdf'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Images to PDF
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('watermark'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    Watermark Generator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTool('qr-code'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-indigo-600">
                    QR Code Generator
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Legal & Documentation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => setLegalModal('privacy')} className="hover:text-indigo-600">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('terms')} className="hover:text-indigo-600">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('contact')} className="hover:text-indigo-600">
                    Contact & Support
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('docs')} className="hover:text-indigo-600 font-semibold text-indigo-600 dark:text-indigo-400">
                    Deploy & SEO Guide
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 OptiPixel. All rights reserved. Free browser-based image utilities.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% In-Browser Privacy
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Docs Modals */}
      <LegalModals modalType={legalModal} onClose={() => setLegalModal(null)} />

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
