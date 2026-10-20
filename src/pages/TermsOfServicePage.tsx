import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { FileText, ShieldAlert, CheckCircle, Scale, AlertTriangle } from 'lucide-react';

interface TermsOfServicePageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Terms of Service"
        subtitle="Clear, reasonable guidelines governing the use of OptiPixel's image processing tools and services."
        category="Legal"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <strong>Effective Date:</strong> October 2026 · By using or accessing OptiPixel, you agree to comply with and be bound by these Terms of Service.
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            OptiPixel (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) provides browser-based utilities for compressing, resizing, converting, and editing images. By accessing this website (https://optipixel.app), you acknowledge that you have read, understood, and agreed to these Terms of Service and our Privacy Policy. If you do not agree, you must discontinue use immediately.
          </p>
        </section>

        {/* 2. User Intellectual Property & Ownership */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Intellectual Property & Your Ownership of Images
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>You retain 100% ownership and copyright</strong> of all photos, graphics, artwork, and documents you process using OptiPixel.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>OptiPixel claims zero ownership, license, or distribution rights over your uploaded or edited files.</li>
            <li>Because all image manipulation occurs locally within your web browser, our servers never store or acquire access to your intellectual property.</li>
            <li>You represent that you own or possess lawful rights to edit and modify any images you process through our tools.</li>
          </ul>
        </section>

        {/* 3. Acceptable Use Guidelines */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Acceptable Use Policy
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            You agree to use OptiPixel solely for lawful purposes. You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Attempt to reverse-engineer, disrupt, or exploit website infrastructure or deny service to other users.</li>
            <li>Use the website to create fraudulent identity documents or deliberately deceptive materials intended for unlawful impersonation.</li>
            <li>Distribute malware, malicious script payloads, or exploit vulnerabilities in browser canvas decoders.</li>
            <li>Automate scraping or traffic flooding that degrades site availability.</li>
          </ul>
        </section>

        {/* 4. Passport & ID Photo Maker Assistance Disclaimer */}
        <section className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Biometric Passport & Official Photo Disclaimer
            </h2>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            The Passport Photo Maker provides mathematical dimension templates (such as US 2x2&quot;, UK/EU 35x45mm, India 35x45mm, Canada 50x70mm) and biometric head alignment guides based on published public guidelines.
          </p>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            <strong>Important:</strong> OptiPixel is not affiliated with any government, embassy, passport agency, or consulate. Official agencies reserve unilateral discretion regarding lighting, shadows, facial expression, background neutrality, and paper weight. You remain solely responsible for ensuring your final printed photos comply with the official requirements of your destination country.
          </p>
        </section>

        {/* 5. Technical Limitations & Device Performance */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. Technical Limitations & Device Memory
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            OptiPixel performs high-resolution image transformations using client-side Web APIs. Processing capability is subject to your device hardware, operating system, and browser memory quotas:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Very large files (e.g., RAW camera files exceeding 50 MB or 40+ megapixel panoramas) may experience browser tab slowdowns or memory exhaustion on mobile devices.</li>
            <li>Format support (such as AVIF) depends on your specific web browser version.</li>
          </ul>
        </section>

        {/* 6. Warranty Disclaimers & Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            6. Warranty Disclaimers & Limitation of Liability
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            OptiPixel is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, implied, or statutory. We disclaim all implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            In no event shall OptiPixel or its developers be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, our image tools.
          </p>
        </section>

        {/* 7. Contact for Legal Inquiries */}
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            7. Contact Information
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            For questions regarding these Terms of Service, contact our administrative team at:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs">
            <strong>Email:</strong> <a href="mailto:support@optipixel.app" className="text-indigo-600 dark:text-indigo-400 font-mono">support@optipixel.app</a>
          </div>
        </section>
      </div>
    </div>
  );
};
