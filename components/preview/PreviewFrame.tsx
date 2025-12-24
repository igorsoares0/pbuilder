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
            // Remove all import statements
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
