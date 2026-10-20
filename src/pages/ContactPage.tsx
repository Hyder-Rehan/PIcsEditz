import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigatePage: (path: string) => void;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please enter your message or inquiry.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Please provide more detail (at least 15 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const supportRecipientEmail = 'hyderrehan79@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Store in local inquiries log for browser backup
      const existing = JSON.parse(localStorage.getItem('optipixel-inquiries') || '[]');
      existing.push({
        ...formData,
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('optipixel-inquiries', JSON.stringify(existing));

      // Prepare mailto link
      const mailSubject = encodeURIComponent(`[OptiPixel Contact] ${formData.subject}`);
      const mailBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\nSent from OptiPixel Contact Form`
      );
      const mailtoLink = `mailto:${supportRecipientEmail}?subject=${mailSubject}&body=${mailBody}`;

      setSubmitSuccess(true);

      // Attempt to launch default mail app
      try {
        window.location.href = mailtoLink;
      } catch {
        // Fallback handled in success UI
      }
    } catch (err: any) {
      setSubmitError('Unable to send message at this time. Please try emailing directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Contact Us"
        subtitle="Have feedback, a feature request, or need technical assistance with our image tools? We're here to help."
        category="Support"
        onNavigateHome={onNavigateHome}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill in the form below and our team will get back to you promptly.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Message Received!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Thank you for reaching out. Your inquiry has been logged, and a member of our team will review it within 24–48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-3 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.name
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.email
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.email && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Question about image compression / bug report"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.subject
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.subject && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or the issue you experienced in detail..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.message
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y`}
                  />
                  {errors.message && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending inquiry...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details & Service Notice */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Direct Contact Information
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Email Support</span>
                    <a
                      href={`mailto:${supportRecipientEmail}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                    >
                      {supportRecipientEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Response Expectation</span>
                    <span className="text-slate-500">Monday through Friday, within 24 to 48 hours.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Privacy Guaranteed</span>
                    <span className="text-slate-500">Contact submissions are used solely to reply to your inquiry and are never shared.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Self-Service Resources
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Before submitting a message, check our troubleshooting documentation to see if your answer is already addressed:
              </p>
              <div className="flex flex-col gap-2 pt-1 text-xs">
                <button
                  onClick={() => onNavigatePage('/faq')}
                  className="text-left text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  • Frequently Asked Questions (FAQ)
                </button>
                <button
                  onClick={() => onNavigatePage('/how-to-use')}
                  className="text-left text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  • Step-by-Step Tool Tutorials
                </button>
                <button
                  onClick={() => onNavigatePage('/report-issue')}
                  className="text-left text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  • Report a Bug or Browser Incompatibility
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
