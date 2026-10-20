import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { AlertTriangle, Camera, Layers, ExternalLink, HelpCircle } from 'lucide-react';

interface DisclaimerPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Disclaimer"
        subtitle="Important disclosures concerning image processing variances, biometric specifications, and third-party advertising."
        category="Legal"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Notice 1: Image Processing & Compression Variances */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Image Processing & Compression Variances
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The results of image compression, format conversion, and dimension resizing vary substantially depending on the technical characteristics of the original file, including its color depth, high-frequency detail, noise levels, and initial encoding quality.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Target File Size Mode:</strong> When requesting a maximum target file size (e.g., &quot;under 150 KB&quot;), our binary search algorithm attempts to find the optimal quality factor. However, for extremely complex, high-resolution photographs, achieving very small target sizes may introduce visible compression artifacts or be mathematically impossible without downscaling pixel dimensions in the Image Resizer.
            </li>
            <li>
              <strong>Lossy vs Lossless:</strong> While formats like PNG and lossless WebP maintain byte-for-byte pixel accuracy, lossy conversions (like JPEG) discard imperceptible chrominance data. We encourage using our interactive Before/After split slider to evaluate output quality before downloading.
            </li>
          </ul>
        </section>

        {/* Notice 2: Biometric Passport Photo Assistance Disclaimer */}
        <section className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Camera className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Biometric Passport & ID Photos
            </h2>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            The Passport Size Photo Maker offers pre-configured dimensions and alignment overlays for common specifications (United States 2x2&quot;, United Kingdom/EU 35x45mm, India 35x45mm & 2x2&quot;, Canada 50x70mm, etc.) calibrated to 300 DPI print standards.
          </p>
          <div className="text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <p>
              • <strong>No Official Guarantee of Acceptance:</strong> OptiPixel is an independent digital tool. We cannot guarantee that an embassy, consulate, passport agency, or government authority will approve your final photo.
            </p>
            <p>
              • <strong>Strict Government Regulations:</strong> Most immigration authorities reject photographs with glares, excessive shadows, un-neutral facial expressions, inappropriate headwear, or incorrect eye-to-chin proportions.
            </p>
            <p>
              • <strong>User Responsibility:</strong> You must consult and follow the latest official photo guidelines provided by your destination country’s immigration portal before printing or submitting your application.
            </p>
          </div>
        </section>

        {/* Notice 3: Third-Party Advertising & External Links */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ExternalLink className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. Third-Party Advertisements & External Links
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            OptiPixel displays contextual and display advertising powered by Google AdSense and third-party advertising partners.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>We do not directly endorse, review, or verify the goods, services, or claims advertised by third-party sponsors appearing on our pages.</li>
            <li>Clicking on external advertisements directs you to external web properties governed by their respective privacy policies and terms of service.</li>
            <li>We disclaim all liability regarding transactions or interactions conducted with third-party advertisers.</li>
          </ul>
        </section>

        {/* Notice 4: Technical Availability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Service Availability & Changes
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            While we strive for continuous uptime and compatibility across modern browsers (Chrome, Edge, Safari, Firefox, iOS, and Android), we do not warrant that OptiPixel will operate uninterrupted or error-free at all times. We reserve the right to modify, enhance, or discontinue any feature without prior notice.
          </p>
        </section>

        {/* Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <button onClick={() => onNavigatePage('/terms')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            ← Terms of Service
          </button>
          <button onClick={() => onNavigatePage('/faq')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Frequently Asked Questions →
          </button>
        </div>
      </div>
    </div>
  );
};
