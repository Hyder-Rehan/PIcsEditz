import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { ShieldCheck, Lock, Cookie, Eye, ExternalLink, RefreshCw } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Privacy Policy"
        subtitle="Transparent information on how your data is treated, our in-browser processing architecture, and our advertising disclosure."
        category="Legal"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Effective date & Summary */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Last Updated: October 2026</span>
            <span className="text-slate-500">Applies to all visitors and tools on OptiPixel (https://optipixel.app)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Browser Privacy Verified</span>
          </div>
        </div>

        {/* 1. Core Commitment: Images Never Leave Your Device */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Image Processing & Local Storage Architecture</span>
          </h2>
          <p>
            Unlike traditional web-based photo editing utilities that upload your sensitive images to a cloud backend or remote storage cluster, <strong>OptiPixel is engineered as a client-side web application</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-400 text-xs">
            <li>
              <strong>No Server Uploads:</strong> When you select or drag-and-drop an image (JPG, PNG, WebP, AVIF, BMP, GIF), the file is read exclusively by your local browser runtime via the standard HTML5 File and Canvas APIs.
            </li>
            <li>
              <strong>Memory-Only Processing:</strong> Calculations for image compression, aspect-ratio scaling, background edge segmentation, filter adjustments, and PDF compilation take place inside your device’s volatile RAM.
            </li>
            <li>
              <strong>No Image Archiving:</strong> We operate no database, cloud bucket, or media server capable of retaining, inspecting, or indexing your photographs. When you close the browser tab or refresh the page, all loaded image data is destroyed immediately.
            </li>
          </ul>
        </section>

        {/* 2. Information We Collect Automatically */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Information Collected Automatically
          </h2>
          <p>
            When you visit OptiPixel, standard non-identifying server log information may be collected automatically by our hosting platform (e.g., Vercel / Cloud CDN) solely for diagnostic, security, and performance purposes. This information includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Your browser type, operating system, and language preference.</li>
            <li>Approximate geographic region (country or city level derived from IP).</li>
            <li>Referring website addresses and date/time stamps of page requests.</li>
          </ul>
          <p className="text-xs">
            This technical data cannot be used to personally identify you or link your identity to any images processed in your browser.
          </p>
        </section>

        {/* 3. Google AdSense & Advertising Cookies Disclosure */}
        <section className="space-y-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>3. Google AdSense & Third-Party Advertising Policy</span>
          </h2>
          <p>
            To keep all image editing, compression, and passport utilities completely free for all users, OptiPixel displays advertisements provided by Google AdSense and certified third-party ad networks.
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p>
              • Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites across the Internet.
            </p>
            <p>
              • Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to OptiPixel and/or other sites on the Internet.
            </p>
            <p>
              • <strong>Your Opt-Out Choices:</strong> Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold"
              >
                aboutads.info
              </a>
              .
            </p>
          </div>
        </section>

        {/* 4. Local Storage Usage */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Browser Local Storage & Preference Cookies
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            OptiPixel uses browser <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">localStorage</code> solely to remember your chosen user experience settings between sessions:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Theme Preference:</strong> Stores whether you prefer Dark or Light color mode (<code className="font-mono">optipixel-theme</code>).</li>
            <li><strong>Cookie Consent:</strong> Records your acknowledgment of our cookie disclosure (<code className="font-mono">optipixel-cookie-consent</code>).</li>
          </ul>
        </section>

        {/* 5. User Rights (GDPR & CCPA/CPRA) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. User Rights Under GDPR & CCPA/CPRA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Depending on your geographic location (including the European Economic Area, United Kingdom, and State of California), you hold legal privacy rights regarding your data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Right of Access & Portability:</strong> Since we do not collect or maintain user accounts or personal profiles, we hold no stored personal dossiers to deliver or export.</li>
            <li><strong>Right to Deletion:</strong> Your uploaded images are never stored on our infrastructure and are cleared from your device memory when closing the browser session.</li>
            <li><strong>Non-Discrimination:</strong> We do not discriminate against any user exercising their legal privacy rights.</li>
          </ul>
        </section>

        {/* 6. Children's Online Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            6. Children&apos;s Online Privacy Protection (COPPA)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            OptiPixel does not knowingly collect or solicit any personal information from children under the age of 13. All utilities operate on a general-audience basis without requesting identity credentials.
          </p>
        </section>

        {/* 7. Contact Information & Updates */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            7. Contact Us Regarding Privacy
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            If you have questions, comments, or requests regarding this Privacy Policy, please contact our privacy compliance team:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div><strong>Email:</strong> <a href="mailto:support@optipixel.app" className="text-indigo-600 dark:text-indigo-400 font-mono">support@optipixel.app</a></div>
            <div><strong>Website:</strong> <span className="font-mono">https://optipixel.app</span></div>
            <div><strong>Mailing Address:</strong> OptiPixel Privacy Compliance Office (Inquiries handled digitally via email)</div>
          </div>
        </section>
      </div>
    </div>
  );
};
