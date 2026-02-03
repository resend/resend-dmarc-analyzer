'use client';

import { useState } from 'react';
import { ReportViewer } from '@/components/dmarc';
import { parseAndAnalyze } from '@/lib/dmarc/parser';
import type { DMARCAnalysis } from '@/types/dmarc';

export default function Home() {
  const [xml, setXml] = useState('');
  const [analysis, setAnalysis] = useState<DMARCAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (!xml.trim()) {
      setError('Please paste a DMARC report XML');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = parseAndAnalyze(xml);
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to parse DMARC report',
      );
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setXml('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-3">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-10"
            >
              <path
                d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-lg font-semibold text-gray-10">
              DMARC Analyzer
            </h1>
          </div>
          <a
            href="https://resend.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-6 hover:text-gray-9 transition-colors"
          >
            Powered by Resend
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!analysis ? (
          <div className="space-y-6">
            {/* Hero */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-semibold text-gray-10 mb-3">
                Analyze DMARC Reports
              </h2>
              <p className="text-gray-6 max-w-lg mx-auto">
                Paste your DMARC aggregate report (RUA) XML below to get a
                detailed breakdown of your email authentication results.
              </p>
            </div>

            {/* Input Area */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={xml}
                  onChange={(e) => setXml(e.target.value)}
                  placeholder="Paste your DMARC XML here..."
                  className="w-full h-80 bg-gray-2 border border-gray-3 rounded-xl p-4 font-mono text-sm text-gray-9 placeholder-gray-5 focus:outline-none focus:border-gray-5 resize-none"
                />
                {xml && (
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 text-gray-5 hover:text-gray-7 transition-colors"
                    aria-label="Clear input"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-dim border border-red/30 rounded-lg px-4 py-3 text-sm text-red">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !xml.trim()}
                className="w-full bg-gray-10 text-gray-1 font-medium py-3 px-6 rounded-xl hover:bg-gray-9 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Report'}
              </button>
            </div>

            {/* Info */}
            <div className="border border-gray-3 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-medium text-gray-10 mb-4">
                What is DMARC?
              </h3>
              <p className="text-sm text-gray-7 leading-relaxed">
                DMARC (Domain-based Message Authentication, Reporting &
                Conformance) is an email authentication protocol that protects
                your domain from being used for email spoofing. DMARC aggregate
                reports (RUA) are sent by email receivers to help you understand
                how your domain&apos;s email is being authenticated.
              </p>
            </div>

            {/* Deploy */}
            <div className="relative border border-gray-3 rounded-xl p-6 overflow-hidden">
              <div className="relative z-10 md:max-w-[60%]">
                <h3 className="text-lg font-medium text-gray-10 mb-4">
                  Deploy your own DMARC Analyzer
                </h3>
                <p className="text-sm text-gray-7 leading-relaxed mb-4">
                  This project is open source. Deploy your own instance to
                  automatically receive and analyze DMARC reports via email.
                  Using{' '}
                  <a
                    href="https://resend.com/inbound"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-9 underline underline-offset-2 hover:text-gray-10"
                  >
                    Resend Inbound
                  </a>{' '}
                  to receive reports and{' '}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-9 underline underline-offset-2 hover:text-gray-10"
                  >
                    Resend
                  </a>{' '}
                  to send beautiful email digests built with{' '}
                  <a
                    href="https://react.email"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-9 underline underline-offset-2 hover:text-gray-10"
                  >
                    React Email
                  </a>
                  , you can have automated DMARC monitoring for your domains.
                </p>
                <a
                  href="https://github.com/resend/resend-dmarc-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-10 hover:text-gray-9 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
              {/* Email preview placeholder - positioned within the section */}
              <div
                className="hidden md:flex absolute -bottom-12 -right-8 w-64 lg:w-72 aspect-[3/4] bg-gray-2 border border-gray-3 rounded-lg shadow-2xl items-center justify-center"
                style={{ transform: 'rotate(12deg)' }}
              >
                <span className="text-xs text-gray-5">Email preview</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={handleClear}
              className="flex items-center gap-2 text-sm text-gray-6 hover:text-gray-9 transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Analyze another report
            </button>

            {/* Report Viewer */}
            <ReportViewer analysis={analysis} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-3 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-6">
          <a
            href="https://github.com/resend/resend-dmarc-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-9 transition-colors"
          >
            DMARC Analyzer
          </a>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://resend.com/blog/how-to-read-a-dmarc-report"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-9 transition-colors"
            >
              How to read a DMARC report
            </a>
            <a
              href="https://resend.com/blog/dmarc-policy-modes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-9 transition-colors"
            >
              DMARC policy modes
            </a>
            <a
              href="https://resend.com/blog/how-dmarc-applies-to-subdomains"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-9 transition-colors"
            >
              DMARC and subdomains
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
