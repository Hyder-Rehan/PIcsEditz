import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { AlertCircle, CheckCircle2, Send, HelpCircle, Laptop, Smartphone, Mail, Inbox, ExternalLink, Trash2 } from 'lucide-react';

interface ReportIssuePageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [issueType, setIssueType] = useState('compression');
  const [browser, setBrowser] = useState('Chrome on Desktop');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAdminLogs, setShowAdminLogs] = useState(false);
  const [storedIssues, setStoredIssues] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('optipixel-reported-issues') || '[]');
  });

  const supportRecipientEmail = 'hyderrehan79@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newIssue = {
      id: 'issue-' + Date.now(),
      type: issueType,
      browser,
      description,
      userEmail: userEmail || 'Anonymous Visitor',
      timestamp: new Date().toLocaleString(),
    };

    // Save issue to localStorage
    const updated = [newIssue, ...storedIssues];
    setStoredIssues(updated);
    localStorage.setItem('optipixel-reported-issues', JSON.stringify(updated));

    // Also trigger prefilled mailto draft so it can be sent directly to hyderrehan79@gmail.com
    const mailSubject = encodeURIComponent(`[OptiPixel Issue] ${issueType} - ${browser}`);
    const mailBody = encodeURIComponent(
      `Issue Type: ${issueType}\nBrowser/Device: ${browser}\nReported By: ${userEmail || 'Anonymous'}\n\nDescription of Problem:\n${description}\n\nSent from OptiPixel Help Center`
    );
    const mailtoLink = `mailto:${supportRecipientEmail}?subject=${mailSubject}&body=${mailBody}`;

    setSubmitted(true);

    // Optional quick redirect to open user's default email client
    try {
      window.location.href = mailtoLink;
    } catch {
      // In case popup or mailto is blocked by sandbox, the confirmation UI provides direct button
    }
  };

  const handleClearLogs = () => {
    localStorage.removeItem('optipixel-reported-issues');
    setStoredIssues([]);
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Report an Issue & Help Center"
        subtitle="Encountered a bug or technical glitch? Reports are sent directly to our support team."
        category="Support"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Recipient Notice Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Mail className="w-4 h-4 shrink-0" />
            <span>
              All problem reports and inquiries are directed to the site administrator at{' '}
              <strong className="font-mono text-indigo-900 dark:text-indigo-200">{supportRecipientEmail}</strong>.
            </span>
          </div>
          <button
            onClick={() => setShowAdminLogs(!showAdminLogs)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-50 shrink-0"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>{showAdminLogs ? 'Hide Report Log' : `View Reported Issues (${storedIssues.length})`}</span>
          </button>
        </div>

        {/* Admin Reports Log Viewer (if toggled) */}
        {showAdminLogs && (
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Local Issues Inbox (Admin Viewer)
                </h3>
                <p className="text-xs text-slate-500">
                  Every issue submitted in this browser is logged here and also forwarded to {supportRecipientEmail}:
                </p>
              </div>
              {storedIssues.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {storedIssues.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reports logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {storedIssues.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                        Category: {item.type}
                      </span>
                      <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{item.description}</p>
                    <div className="text-[11px] text-slate-500 flex gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>Device: <strong>{item.browser}</strong></span>
                      <span>From: <strong>{item.userEmail}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                  Report Received & Logged!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your report has been saved and addressed to our administrator at <strong className="font-mono">{supportRecipientEmail}</strong>.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={`mailto:${supportRecipientEmail}?subject=${encodeURIComponent(`[OptiPixel Issue] ${issueType}`)}&body=${encodeURIComponent(description)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setDescription('');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  >
                    Submit Another Report
                  </button>
                </div>
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
                    <option value="Image Compression">Image Compression Glitch</option>
                    <option value="Image Resizer">Resizing / Aspect Ratio Issue</option>
                    <option value="Format Converter">Format Converter Failure</option>
                    <option value="Background Remover">Background Remover / Masking</option>
                    <option value="Passport Photo">Passport Photo Alignment or Print Sheet</option>
                    <option value="Performance & Memory">Browser Freezing or Slowdown</option>
                    <option value="General Feedback">Other / General Feedback</option>
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
                    Your Email (Optional, to receive a direct reply)
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Problem Report to {supportRecipientEmail}</span>
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

            {/* Direct Admin Contact */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Direct Admin Contact:</div>
              <div>
                Email:{' '}
                <a href={`mailto:${supportRecipientEmail}`} className="text-indigo-600 dark:text-indigo-400 font-mono font-bold hover:underline">
                  {supportRecipientEmail}
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                You can also email directly with attached screenshots or problematic image files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
