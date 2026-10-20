import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Sparkles, UploadCloud } from 'lucide-react';
import { ToolId } from '../types';

interface NavbarProps {
  currentPath: string;
  activeTool: ToolId | null;
  onNavigatePage: (path: string) => void;
  onSelectTool: (tool: ToolId) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  activeTool,
  onNavigatePage,
  onSelectTool,
  isDark,
  onToggleDark,
  onOpenUpload,
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
        {/* Zone 1: Single text wordmark Brand */}
        <button
          onClick={() => onNavigatePage('/')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Opti<span className="text-indigo-600 dark:text-indigo-400">Pixel</span>
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              if (currentPath !== '/') {
                onNavigatePage('/');
              } else {
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`transition-colors whitespace-nowrap ${
              currentPath === '/' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            Tools
          </button>

          <button
            onClick={() => onNavigatePage('/how-to-use')}
            className={`transition-colors whitespace-nowrap ${
              currentPath === '/how-to-use' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            How to Use
          </button>

          <button
            onClick={() => onNavigatePage('/faq')}
            className={`transition-colors whitespace-nowrap ${
              currentPath === '/faq' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            FAQ
          </button>

          <button
            onClick={() => onNavigatePage('/about')}
            className={`transition-colors whitespace-nowrap ${
              currentPath === '/about' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => onNavigatePage('/contact')}
            className={`transition-colors whitespace-nowrap ${
              currentPath === '/contact' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action + dark toggle */}
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

          {/* Mobile hamburger */}
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
        <div className="lg:hidden px-4 pt-3 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigatePage('/');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Image Tools
            </button>
            <button
              onClick={() => {
                onNavigatePage('/how-to-use');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How to Use Our Tools
            </button>
            <button
              onClick={() => {
                onNavigatePage('/faq');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => {
                onNavigatePage('/about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onNavigatePage('/contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Image Tools Quick Jump</div>
            <div className="grid grid-cols-2 gap-1.5">
              {navTools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onNavigatePage('/');
                    onSelectTool(t.id);
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 truncate"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button onClick={() => { onNavigatePage('/privacy'); setMobileMenuOpen(false); }} className="hover:underline">Privacy Policy</button>
            <button onClick={() => { onNavigatePage('/terms'); setMobileMenuOpen(false); }} className="hover:underline">Terms of Service</button>
            <button onClick={() => { onNavigatePage('/disclaimer'); setMobileMenuOpen(false); }} className="hover:underline">Disclaimer</button>
          </div>
        </div>
      )}
    </header>
  );
};
