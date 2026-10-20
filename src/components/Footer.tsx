import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { ToolId } from '../types';

interface FooterProps {
  onNavigatePage: (path: string) => void;
  onSelectTool: (tool: ToolId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage, onSelectTool }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigatePage('/')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Opti<span className="text-indigo-600 dark:text-indigo-400">Pixel</span>
              </span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              OptiPixel is an all-in-one browser-native image toolkit designed for speed and uncompromising privacy. All image compression, resizing, conversion, and editing routines execute 100% on your device with zero cloud storage.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Local In-Browser Processing Guarantee</span>
            </div>
          </div>

          {/* Col 2: Image Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Image Tools
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('compress');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('resize');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('convert');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Format Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('background');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Background Remover
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('editor');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Full Photo Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool('passport');
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Passport Photo Maker
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Information
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigatePage('/about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/how-to-use')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  How to Use Our Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/faq')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/report-issue')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Report a Problem
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Legal & Compliance
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigatePage('/privacy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('/disclaimer')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Legal Disclaimer
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Notices */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 OptiPixel. All rights reserved. Free browser-based image utilities.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>AdSense Monetized Service</span>
            <span>·</span>
            <span>Zero Remote Storage</span>
            <span>·</span>
            <span>SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
