import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { AlertCircle, CheckCircle2, Send, HelpCircle, Laptop, Smartphone, RefreshCw } from 'lucide-react';

interface ReportIssuePageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [issueType, setIssueType] = useState('bug');
  const [browser, setBrowser] = useState('Chrome');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Save issue to localStorage for session tracking
    const issues = JSON.parse(localStorage.getItem('optipixel-reported-issues') || '[]');
    issues.push({
      type: issueType,
      browser,
      description,
      userEmail,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('optipixel-reported-issues', JSON.stringify(issues));

    setSubmitted(true);
    setDescription('');
    setUserEmail('');
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Report an Issue & Help Center"
        subtitle="Encountered a problem or have a technical glitch to report? Let us know so our engineering team can investigate."
        category="Support"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Issue Form */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Submit a Problem Report
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Report Received!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Thank you for helping us maintain OptiPixel. Our developers review all bug reports to improve cross-browser compatibility.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-white rounded-xl border border-emerald-200"
                >
                  Report Another Bug
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Problem Category
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="compression">Image Compression Glitch</option>
                    <option value="resizer">Resizing / Aspect Ratio Issue</option>
                    <option value="conversion">Format Converter Failure</option>
                    <option value="background">Background Remover / Masking</option>
                    <option value="passport">Passport Photo Alignment or Print Sheet</option>
                    <option value="performance">Browser Freezing or Slowdown</option>
                    <option value="other">Other / General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Web Browser & Device
                  </label>
                  <input
                    type="text"
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    placeholder="e.g., Chrome 124 on macOS, Safari on iPhone 15"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Problem Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe what happened (e.g. image showed black box when converting PNG to JPG, or upload button didn't open file dialog)..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Email (Optional, if you wish to receive a reply)
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="optional@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Problem Report</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Quick Troubleshooting Tips */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Common Troubleshooting Fixes
              </h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">1. Out of Memory on Mobile</span>
                  <span>If your mobile browser reloads when editing 40+ megapixel photos, downscale the resolution using the Image Resizer first to fit within mobile RAM limits.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">2. AVIF Format Unsupported</span>
                  <span>Older browsers may not support native AVIF encoding. If AVIF appears disabled, use WebP or PNG for identical transparency and compression capabilities.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">3. Clear Cached Scripts</span>
                  <span>If an image tool seems unresponsive, perform a hard refresh (<kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">Ctrl+F5</kbd> or <kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">Cmd+Shift+R</kbd>) to reload fresh client canvas workers.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
