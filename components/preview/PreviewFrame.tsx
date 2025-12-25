'use client';

import { useEffect, useRef, useState } from 'react';

interface PreviewFrameProps {
  code: string;
}

export function PreviewFrame({ code }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      try {
        setError(null);

        // Check if it's React/TSX code
        const isReactCode = code.includes('useState') ||
                           code.includes('useEffect') ||
                           code.includes('export default') ||
                           code.includes('use client');

        let htmlContent: string;

        if (isReactCode) {
          // Clean up the code for browser execution
          let cleanCode = code
            // Remove 'use client' and 'use server' directives
            .replace(/^['"]use client['"];?\s*/gm, '')
            .replace(/^['"]use server['"];?\s*/gm, '')
            // Remove all import statements (including icon imports)
            .replace(/import\s+{[^}]*}\s+from\s+['"]@\/components\/ui\/Icons['"];?\s*/g, '')
            .replace(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\s*/g, '')
            .replace(/import\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '')
            .replace(/import\s+['"][^'"]+['"];?\s*/g, '')
            // Remove TypeScript type annotations
            .replace(/:\s*React\.FC/g, '')
            .replace(/:\s*ReactNode/g, '')
            .replace(/:\s*JSX\.Element/g, '')
            .replace(/:\s*React\.ReactNode/g, '')
            // Remove standalone interface and type declarations
            .replace(/interface\s+\w+\s*{[^}]*}/g, '')
            .replace(/type\s+\w+\s*=\s*{[^}]*};?/g, '');

          // Extract the component name
          const componentMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
          const componentName = componentMatch ? componentMatch[1] : 'App';

          // Remove export default
          cleanCode = cleanCode
            .replace(/export\s+default\s+function\s+\w+/g, 'function ' + componentName);

          htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  body { margin: 0; padding: 0; overflow-x: hidden; }
                  #root { min-height: 100vh; }
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  const { useState, useEffect, useRef, useCallback, useMemo } = React;

                  // Common Icon Components
                  const HeartIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  );

                  const StarIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  );

                  const UserIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  );

                  const ChartIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  );

                  const BellIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  );

                  const MenuIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  );

                  const SearchIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  );

                  const XIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  );

                  const CheckIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  );

                  const ArrowRightIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  );

                  const MailIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  );

                  const PhoneIcon = ({ className = "w-6 h-6", ...props }) => (
                    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  );

                  ${cleanCode}

                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(<${componentName} />);
                </script>
              </body>
            </html>
          `;
        } else {
          // Regular HTML code
          const isFullHTML = code.trim().toLowerCase().startsWith('<!doctype') ||
                            code.trim().toLowerCase().startsWith('<html');

          htmlContent = isFullHTML ? code : `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <title>Preview</title>
                <style>
                  body { margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                ${code}
              </body>
            </html>
          `;
        }

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Listen for errors in iframe
        iframe.contentWindow?.addEventListener('error', (e) => {
          console.error('Preview error:', e.error);
          setError(e.error?.message || 'An error occurred in the preview');
        });
      } catch (err) {
        console.error('Failed to render preview:', err);
        setError(err instanceof Error ? err.message : 'Failed to render preview');
      }
    }
  }, [code]);

  if (!code) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No preview available</p>
        <p className="text-gray-400 text-sm mt-2">Generate code to see preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-50 border-b border-red-200 p-4 z-10">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Preview Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 bg-white"
        title="Code Preview"
      />
    </div>
  );
}
