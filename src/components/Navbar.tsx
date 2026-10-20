import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Sparkles, UploadCloud } from 'lucide-react';
import { ToolId } from '../types';

interface NavbarProps {
  activeTool: ToolId | null;
  onSelectTool: (tool: ToolId) => void;
  onResetToHome: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenUpload: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'contact' | 'docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  onSelectTool,
  onResetToHome,
  isDark,
  onToggleDark,
  onOpenUpload,
  onOpenLegal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTools: { id: ToolId; label: string }[] = [
    { id: 'compress', label: 'Compressor' },
    { id: 'resize', label: 'Resizer' },
    { id: 'convert', label: 'Converter' },
    { id: 'background', label: 'Background' },
    { id: 'editor', label: 'Editor' },
    { id: 'passport', label: 'Passport Photo' },
    { id: 'pdf', label: 'Image to PDF' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Opti<span className="text-indigo-600 dark:text-indigo-400">Pixel</span>
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#tools"
            onClick={(e) => {
              if (activeTool) {
                e.preventDefault();
                onResetToHome();
                setTimeout(() => {
                  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            All Tools
          </a>
          <a
            href="#templates"
            onClick={(e) => {
              if (activeTool) {
                e.preventDefault();
                onResetToHome();
                setTimeout(() => {
                  document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            Templates
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              if (activeTool) {
                e.preventDefault();
                onResetToHome();
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              if (activeTool) {
                e.preventDefault();
                onResetToHome();
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            FAQ
          </a>
          <button
            onClick={() => onOpenLegal('docs')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap text-left"
          >
            Guide & Deploy
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 active:scale-95 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Image</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">Quick Tools</div>
          <div className="grid grid-cols-2 gap-2">
            {navTools.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTool(t.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                  activeTool === t.id
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button onClick={() => { onOpenLegal('docs'); setMobileMenuOpen(false); }} className="hover:underline">Documentation & Deploy</button>
            <button onClick={() => { onOpenLegal('privacy'); setMobileMenuOpen(false); }} className="hover:underline">Privacy</button>
            <button onClick={() => { onOpenLegal('terms'); setMobileMenuOpen(false); }} className="hover:underline">Terms</button>
          </div>
        </div>
      )}
    </header>
  );
};
