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
import { Footer } from './components/Footer';
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
import { CookieBanner } from './components/LegalModals';
import { SAMPLE_ASSETS } from './data/presets';
import { updatePageSeo } from './utils/seo';

// Dedicated Informational & Legal Pages
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { FaqPage } from './pages/FaqPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { ReportIssuePage } from './pages/ReportIssuePage';

export default function App() {
  // Client URL route management
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [activeTool, setActiveTool] = useState<ToolId>('compress');
  const [hasLoadedFiles, setHasLoadedFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<ImageFileItem[]>([]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('optipixel-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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

  // Sync browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      updatePageSeo(path);
    };

    window.addEventListener('popstate', handlePopState);
    updatePageSeo(currentPath);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Dynamic route navigator
  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    updatePageSeo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      if (currentPath !== '/') {
        navigateTo('/');
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

  const handleLaunchToolFromPage = (toolId: string) => {
    navigateTo('/');
    setActiveTool(toolId as ToolId);
    if (!hasLoadedFiles) {
      const sample = toolId === 'passport'
        ? SAMPLE_ASSETS.portrait
        : toolId === 'background'
        ? SAMPLE_ASSETS.product
        : SAMPLE_ASSETS.landscape;
      handleLoadSample(sample, `demo_${toolId}.jpg`, toolId as ToolId);
    }
    setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
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
      {/* Universal Top Bar Header */}
      <Navbar
        currentPath={currentPath}
        activeTool={hasLoadedFiles ? activeTool : null}
        onNavigatePage={navigateTo}
        onSelectTool={(tool) => {
          if (currentPath !== '/') navigateTo('/');
          setActiveTool(tool);
          if (!hasLoadedFiles) {
            handleLoadSample(SAMPLE_ASSETS.landscape, 'demo_landscape.jpg', tool);
          }
          setTimeout(() => {
            document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenUpload={() => {
          if (currentPath !== '/') navigateTo('/');
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = (e: any) => {
            if (e.target.files) handleFilesSelected(e.target.files);
          };
          input.click();
        }}
      />

      <main className="flex-1">
        {/* ROUTE 1: ABOUT US PAGE */}
        {currentPath === '/about' && (
          <AboutPage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 2: CONTACT US PAGE */}
        {currentPath === '/contact' && (
          <ContactPage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 3: PRIVACY POLICY PAGE */}
        {currentPath === '/privacy' && (
          <PrivacyPolicyPage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 4: TERMS OF SERVICE PAGE */}
        {currentPath === '/terms' && (
          <TermsOfServicePage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 5: DISCLAIMER PAGE */}
        {currentPath === '/disclaimer' && (
          <DisclaimerPage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 6: FAQ PAGE */}
        {currentPath === '/faq' && (
          <FaqPage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* ROUTE 7: HOW TO USE PAGE */}
        {currentPath === '/how-to-use' && (
          <HowToUsePage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
            onLaunchTool={handleLaunchToolFromPage}
          />
        )}

        {/* ROUTE 8: REPORT ISSUE / HELP CENTER */}
        {currentPath === '/report-issue' && (
          <ReportIssuePage
            onNavigateHome={() => navigateTo('/')}
            onNavigatePage={navigateTo}
          />
        )}

        {/* DEFAULT ROUTE: HOMEPAGE WITH FULL TOOLKIT */}
        {currentPath === '/' && (
          <>
            {/* Hero Section with Drag & Drop Zone */}
            <Hero
              onFilesSelected={(fileList, initialTool) => handleFilesSelected(fileList, initialTool)}
              onLoadSample={handleLoadSample}
            />

            {/* AdSense Top Leaderboard */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdPlacement slotType="horizontal-leaderboard" />
            </div>

            {/* WORKSPACE AREA */}
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
                              const sample = t.id === 'passport'
                                ? SAMPLE_ASSETS.portrait
                                : t.id === 'background'
                                ? SAMPLE_ASSETS.product
                                : SAMPLE_ASSETS.landscape;
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
          </>
        )}
      </main>

      {/* Universal Footer Component with All Links */}
      <Footer
        onNavigatePage={navigateTo}
        onSelectTool={(tool) => {
          if (currentPath !== '/') navigateTo('/');
          setActiveTool(tool);
          if (!hasLoadedFiles) {
            handleLoadSample(SAMPLE_ASSETS.landscape, 'demo_landscape.jpg', tool);
          }
          setTimeout(() => {
            document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
