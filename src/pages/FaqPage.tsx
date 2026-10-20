import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ChevronDown, Search, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

interface FaqItem {
  q: string;
  a: string;
  category: 'compression' | 'resizing' | 'formats' | 'privacy' | 'passport';
}

const EXTENDED_FAQS: FaqItem[] = [
  {
    q: 'How do I compress an image to reduce file size?',
    a: 'Simply upload or drag your image into the Image Compressor. Choose your desired output format (WebP or JPG offer the highest compression ratio), then adjust the Visual Quality slider between 5% and 100%. Alternatively, switch to "Target Max Size" mode and specify an exact maximum file size (such as 150 KB). You can compare pixel quality using the interactive before/after split slider before clicking "Download Compressed".',
    category: 'compression',
  },
  {
    q: 'How do I resize an image by exact pixels or percentage?',
    a: 'In the Image Resizer, enter your target Width and Height in pixels. Keep the aspect ratio lock enabled (the lock icon) to prevent image stretching and distortion. You can also click percentage shortcuts (25%, 50%, 75%, 150%, 200%) or select verified social media presets for Instagram, YouTube thumbnails, X/Twitter posts, Facebook banners, and LinkedIn.',
    category: 'resizing',
  },
  {
    q: 'Which image formats are supported for upload and export?',
    a: 'OptiPixel supports uploading JPG, JPEG, PNG, WebP, AVIF, BMP, and GIF. For export, you can convert to WebP, PNG, JPG/JPEG, AVIF (in compatible browsers), BMP, and GIF. Our converter automatically tests your web browser engine to confirm format compatibility before initiating downloads.',
    category: 'formats',
  },
  {
    q: 'How do I convert a PNG to JPG, and what happens to transparency?',
    a: 'Select the "Converter" tool, choose JPG as your output format, and your image will be converted instantly. Because the official JPEG specification does not support alpha channel transparency, our tool alerts you and allows you to pick a custom matte background color (default is pure white) so that transparent areas are rendered cleanly rather than as black boxes.',
    category: 'formats',
  },
  {
    q: 'Can I preserve a transparent background when saving my image?',
    a: 'Yes! To preserve transparency, always select PNG or WebP as your export format. Both PNG and WebP support 8-bit alpha channels, allowing transparent backgrounds to remain intact for logos, cutouts, product photos, and stickers.',
    category: 'formats',
  },
  {
    q: 'Are my uploaded images stored or sent to any remote server?',
    a: 'No, absolutely not. All image manipulations, compression routines, background segmentation algorithms, and PDF compilations are executed 100% inside your local web browser using the HTML5 Canvas API and JavaScript memory. Your images never leave your computer or phone.',
    category: 'privacy',
  },
  {
    q: 'Is OptiPixel free to use?',
    a: 'Yes, OptiPixel is completely free for personal, commercial, and educational use. There are no paywalls, hidden subscriptions, or account requirements. We sustain operations through clean, non-intrusive Google AdSense advertising that never obstructs your workspace.',
    category: 'privacy',
  },
  {
    q: 'How do I create an official passport-size photo and printable sheet?',
    a: 'Open the "Passport Photo" tool and select your destination country specification (such as United States 2x2", UK/EU 35x45mm, India 35x45mm, or Canada 50x70mm). Use the biometric face alignment overlay and the zoom/pan sliders to align your eyes and chin inside the biometric guides. You can then choose a white or light-blue background, and export either a single high-res photo or a "Printable 4x6" Sheet" containing 4, 6, or 8 photos with cut marks ready for home or pharmacy printing.',
    category: 'passport',
  },
  {
    q: 'How do I combine multiple photos into a single PDF document?',
    a: 'Under the "PDF & More" tab, select the "Image to PDF" tool. Upload your pages, choose your preferred paper format (A4 Standard or US Letter), set orientation (Portrait or Landscape) and page margin in millimeters, then click "Export & Download Combined PDF".',
    category: 'formats',
  },
  {
    q: 'How can I inspect or strip EXIF metadata from my photos?',
    a: 'Under "PDF & More", choose the "EXIF Metadata & Privacy" tool. It inspects image dimensions, color space, and file size. You can click "Strip All Metadata & Download Clean Image" to remove camera serials, timestamps, and embedded GPS locations for maximum online privacy.',
    category: 'privacy',
  },
  {
    q: 'How can I contact support or report a problem?',
    a: 'You can submit an inquiry through our dedicated Contact Us page or email our technical support team directly at support@optipixel.app. We respond within 24–48 business hours.',
    category: 'privacy',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggle = (idx: number) => {
    if (openIndexes.includes(idx)) {
      setOpenIndexes(openIndexes.filter((i) => i !== idx));
    } else {
      setOpenIndexes([...openIndexes, idx]);
    }
  };

  const filtered = EXTENDED_FAQS.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Answers to common questions about image compression, aspect-ratio scaling, background removal, and file safety."
        category="Help & Support"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., compress, passport, transparent background, privacy)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'compression', label: 'Compression' },
            { id: 'resizing', label: 'Resizing' },
            { id: 'formats', label: 'Formats & Alpha' },
            { id: 'passport', label: 'Passport Photos' },
            { id: 'privacy', label: 'Privacy & Security' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 text-xs">
              No matching questions found for &quot;{searchQuery}&quot;. Try another search term or visit our{' '}
              <button onClick={() => onNavigatePage('/contact')} className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                Contact page
              </button>.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = openIndexes.includes(idx);
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className="pr-4">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Support Prompt */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Didn&apos;t find what you were looking for?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Check our step-by-step user guide or reach out directly to our team.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onNavigatePage('/how-to-use')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            >
              How to Use Guide
            </button>
            <button
              onClick={() => onNavigatePage('/contact')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
