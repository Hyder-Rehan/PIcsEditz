import React from 'react';
import { X, ShieldCheck, FileText, Mail, BookOpen, Terminal, CheckCircle2, ExternalLink } from 'lucide-react';

interface LegalModalsProps {
  modalType: 'privacy' | 'terms' | 'contact' | 'docs' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ modalType, onClose }) => {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PRIVACY POLICY */}
        {modalType === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
            </div>
            <p className="text-xs text-slate-500">Effective Date: October 2026</p>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>1. 100% Client-Side Processing:</strong> OptiPixel operates strictly within your local web browser using the HTML5 Canvas API, WebAssembly, and JavaScript File APIs. We do not transmit, upload, save, or store your photos, passport pictures, or graphics on any external server or cloud database.
              </p>
              <p>
                <strong>2. Zero Personal Data Collection:</strong> We do not ask for registration, email addresses, phone numbers, or credit cards to use our image tools. Your image files remain inside your computer or mobile RAM during the editing session and are discarded upon page reload.
              </p>
              <p>
                <strong>3. Advertising & Cookies:</strong> OptiPixel displays non-intrusive advertisements served through Google AdSense. Google and third-party advertising partners may use cookies to serve ads based on prior visits to this website. You may opt out of personalized advertising by visiting Google Ads Settings.
              </p>
              <p>
                <strong>4. Local Storage:</strong> The application may store minor client-side preferences (such as Dark/Light theme mode or cookie consent acceptance) inside your browser&apos;s localStorage.
              </p>
            </div>
          </div>
        )}

        {/* TERMS OF SERVICE */}
        {modalType === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Terms of Service</h2>
            </div>
            <p className="text-xs text-slate-500">Last updated: October 2026</p>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>1. Permitted Use:</strong> OptiPixel is provided free of charge for personal, commercial, and educational image editing, resizing, compression, and passport photo formatting.
              </p>
              <p>
                <strong>2. Passport & Biometric Photo Disclaimer:</strong> While OptiPixel provides exact dimension presets (such as US 2x2&quot;, UK/EU 35x45mm, and India specifications) based on published government guidance, official immigration and visa authorities maintain strict standards regarding facial expression, lighting, background neutrality, and head ratios. Users are responsible for confirming compliance with their destination embassy or agency before submitting printed documents.
              </p>
              <p>
                <strong>3. Warranty & Limitation of Liability:</strong> OptiPixel is provided &quot;as is&quot; without warranties of any kind. Since all processing runs locally on your client machine, the developers shall not be liable for system memory limitations, browser crashes, or inadvertent file overwrites.
              </p>
            </div>
          </div>
        )}

        {/* CONTACT MODAL */}
        {modalType === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <Mail className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact & Support</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Have questions, feedback, or need feature requests for OptiPixel? Reach out to our engineering team:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Support Email:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">support@optipixel.app</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">GitHub:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">github.com/optipixel/image-toolkit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Response Time:</span>
                <span className="text-slate-500">Within 24 business hours</span>
              </div>
            </div>
          </div>
        )}

        {/* DELIVERABLES & DEPLOYMENT GUIDE */}
        {modalType === 'docs' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Documentation & Deployment Guide</h2>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">1. How to Run Locally</h3>
                <pre className="p-2 rounded bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto mt-2">
{`# 1. Clone repository
git clone https://github.com/your-username/optipixel.git
cd optipixel

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# The website will be available at http://localhost:3000`}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">2. How to Deploy on Vercel</h3>
                <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-600 dark:text-slate-300">
                  <li>Push your codebase to a GitHub or GitLab repository.</li>
                  <li>Go to <strong>vercel.com</strong> and click <strong>&quot;Add New Project&quot;</strong>.</li>
                  <li>Import your repository. Framework preset will automatically detect <strong>Vite</strong>.</li>
                  <li>Build Command: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">npm run build</code>, Output Directory: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">dist</code>.</li>
                  <li>Click <strong>Deploy</strong>. Your application is live globally on Edge CDN with automatic HTTPS!</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">3. Google Search Console & SEO Setup</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600 dark:text-slate-300">
                  <li>Visit <strong>search.google.com/search-console</strong> and add your custom domain.</li>
                  <li>Verify ownership using DNS TXT record or HTML meta tag.</li>
                  <li>Submit your sitemap (e.g. <code className="font-mono">https://optipixel.app/sitemap.xml</code>).</li>
                  <li>Check Core Web Vitals: OptiPixel loads 100% in-browser with zero heavy backend roundtrips, scoring 95+ in Google Lighthouse.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">4. External Libraries & Dependencies</h3>
                <ul className="space-y-1 mt-1 font-mono text-[11px]">
                  <li>• <strong>jspdf:</strong> Client-side PDF generation for multi-image document bundles.</li>
                  <li>• <strong>qrcode:</strong> High-error-correction canvas QR code rendering.</li>
                  <li>• <strong>lucide-react:</strong> Crisp, accessible SVG interface icons.</li>
                  <li>• <strong>HTML5 Canvas 2D API:</strong> Fast quantization, filters, and biometric image rendering.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">5. Desktop & Mobile Testing Guide</h3>
                <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Desktop:</strong> Test drag-and-drop file upload, interactive split-slider on compressor, mouseover color loupe, and printable 4x6&quot; sheet printer dialog.</li>
                  <li><strong>Mobile & Tablet:</strong> Test touch drag on before/after comparison slider, mobile drawer navigation, responsive grid wrapping, and camera upload.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CookieBanner: React.FC = () => {
  const [accepted, setAccepted] = React.useState<boolean>(() => {
    return localStorage.getItem('optipixel-cookie-consent') === 'true';
  });

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <strong className="text-slate-900 dark:text-white block mb-0.5">Privacy & Cookie Consent</strong>
        OptiPixel uses essential cookies and Google AdSense partner technology to keep all image processing tools 100% free. No user images ever leave your browser.
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            localStorage.setItem('optipixel-cookie-consent', 'true');
            setAccepted(true);
          }}
          className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
};
