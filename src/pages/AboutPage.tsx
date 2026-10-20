import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ShieldCheck, Cpu, Zap, Lock, EyeOff, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="About OptiPixel"
        subtitle="Empowering creators, developers, and everyday users with fast, private, browser-native image utilities."
        category="Company & Mission"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Section 1: Purpose & Background */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Our Purpose & Vision
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            OptiPixel was created to solve a persistent frustration with modern online utility tools: mandatory account registrations, invasive paywalls, aggressive download limits, and above all, the privacy risk of uploading personal photos to unknown remote servers.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Whether preparing a formal biometric passport photo, compressing high-resolution photographs for web optimization, converting graphics to modern WebP format, or adjusting contrast for social media, users deserve a seamless experience that respects their digital sovereignty.
          </p>
        </section>

        {/* Section 2: Core Capabilities Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            What OptiPixel Provides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Lossless & Lossy Image Compression
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Reduce image file size by up to 85% with granular quality sliders and target maximum file size search algorithms (e.g., target under 150 KB for portal uploads), accompanied by an interactive split-screen before/after slider.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Exact Dimension & Ratio Resizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scale images by exact pixel dimensions, percentage factors, or verified social media presets (Instagram, YouTube thumbnails, X/Twitter, LinkedIn, and Facebook) with aspect ratio lock and cover/contain modes.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Broad Format Conversion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Convert across modern raster formats including WebP, PNG, JPG/JPEG, AVIF, BMP, and GIF with automatic browser capability detection and transparency protection against unexpected matte fills.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Biometric Passport & ID Photo Creator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Format official dimensions for United States (2x2&quot;), United Kingdom & Schengen Visa (35x45mm), India, and Canada with face positioning guides and printable 4x6&quot; multi-photo sheets.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Privacy & In-Browser Technical Architecture */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How Our Image Processing Works: 100% Client-Side
              </h2>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Zero Cloud Uploads · Total Local Privacy
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            OptiPixel uses modern Web APIs: the <strong>HTML5 Canvas 2D API</strong>, <strong>createImageBitmap</strong>, and browser-native image encoders. When you upload or drag an image into the toolkit, the file is read directly from your local filesystem into your device’s volatile memory (RAM).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">No Remote Storage</span>
              <span className="text-slate-500">Your images are never transmitted to, processed by, or saved on any remote web server or cloud bucket.</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Hardware Acceleration</span>
              <span className="text-slate-500">Operations leverage your computer or phone’s GPU rendering pipelines for instant feedback.</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Session Ephemeral</span>
              <span className="text-slate-500">Closing your tab or refreshing immediately purges all loaded image blobs from memory.</span>
            </div>
          </div>
        </section>

        {/* Section 4: Monetization & AdSense Transparency */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            How We Keep OptiPixel Free
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            OptiPixel is offered completely free to all visitors with no subscriptions or mandatory registrations. To support domain registration, hosting, and continuous software development, we integrate non-intrusive banner advertisements through Google AdSense.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We strictly enforce that advertisements never obstruct the image editing workspace, never create deceptive click targets, and strictly adhere to Google Publisher Policies.
          </p>
        </section>

        {/* Section 5: Internal Navigation Links */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs">
          <div className="flex gap-4">
            <button onClick={() => onNavigatePage('/how-to-use')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Read How to Use →
            </button>
            <button onClick={() => onNavigatePage('/privacy')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Read Privacy Policy →
            </button>
            <button onClick={() => onNavigatePage('/contact')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Contact Our Team →
            </button>
          </div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            <span>Launch Image Toolkit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
