'use client';

import { useState } from 'react';
import { useGenerationStore, useUIStore } from '@/store';
import {
  EyeIcon,
  CodeIcon,
  ArrowSquareOutIcon,
  ArrowsClockwiseIcon,
  CornersOutIcon,
  FileArchiveIcon
} from '@/components/ui/Icons';
import toast from 'react-hot-toast';
import { generateNextJsProject } from '@/lib/export/nextjs-project';

export function PreviewToolbar() {
  const { generatedCode } = useGenerationStore();
  const { toggleCodeEditor } = useUIStore();
  const [showCode, setShowCode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleOpenCodeEditor = () => {
    if (!generatedCode) return;
    toggleCodeEditor();
  };

  const handleExportComponent = async () => {
    if (!generatedCode) return;

    try {
      setShowExportMenu(false);

      // Detect if it's React/Next.js code or HTML
      const isReactCode = generatedCode.includes('useState') ||
                         generatedCode.includes('useEffect') ||
                         generatedCode.includes('export default') ||
                         generatedCode.includes('use client');

      const fileExtension = isReactCode ? 'tsx' : 'html';
      const mimeType = isReactCode ? 'text/typescript' : 'text/html';
      const componentName = isReactCode ? 'page' : 'index';

      const blob = new Blob([generatedCode], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${componentName}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Code exported as ${componentName}.${fileExtension}!`);
    } catch (error) {
      toast.error('Failed to export code');
      console.error('Export error:', error);
    }
  };

  const handleExportProject = async () => {
    if (!generatedCode) return;

    try {
      setShowExportMenu(false);
      toast.loading('Generating project...', { id: 'export-project' });

      const blob = await generateNextJsProject(generatedCode);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nextjs-app-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Next.js project exported!', { id: 'export-project' });
    } catch (error) {
      toast.error('Failed to export project', { id: 'export-project' });
      console.error('Export project error:', error);
    }
  };

  const handleOpenInNewTab = () => {
    if (!generatedCode) return;

    // Check if it's React/TSX code
    const isReactCode = generatedCode.includes('useState') ||
                       generatedCode.includes('useEffect') ||
                       generatedCode.includes('export default') ||
                       generatedCode.includes('use client');

    let htmlContent: string;

    if (isReactCode) {
      // Transform TSX to browser-executable HTML
      let cleanCode = generatedCode
        .replace(/^['"]use client['"];?\s*/gm, '')
        .replace(/^['"]use server['"];?\s*/gm, '')
        .replace(/import\s+{[^}]*}\s+from\s+['"]@\/components\/ui\/Icons['"];?\s*/g, '')
        .replace(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\s*/g, '')
        .replace(/import\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '')
        .replace(/import\s+['"][^'"]+['"];?\s*/g, '')
        .replace(/:\s*React\.FC/g, '')
        .replace(/:\s*ReactNode/g, '')
        .replace(/:\s*JSX\.Element/g, '')
        .replace(/:\s*React\.ReactNode/g, '')
        .replace(/interface\s+\w+\s*{[^}]*}/g, '')
        .replace(/type\s+\w+\s*=\s*{[^}]*};?/g, '');

      const componentMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
      const componentName = componentMatch ? componentMatch[1] : 'App';

      cleanCode = cleanCode.replace(/export\s+default\s+function\s+\w+/g, 'function ' + componentName);

      htmlContent = `<!DOCTYPE html>
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
  <script type="text/babel" data-type="module">
    (function() {
      // Wait for React to load
      if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React is not loaded');
        return;
      }

      const { useState, useEffect, useRef, useCallback, useMemo } = React;

    // Icon Components
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
    })();
  </script>
</body>
</html>`;
    } else {
      // Plain HTML
      htmlContent = generatedCode;
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-[#f7f7f7] border-[1.4px] border-black rounded-md px-3 py-2 flex items-center gap-2.5">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-[#161413] hover:opacity-70 transition-opacity p-1"
          title="Toggle Code View"
        >
          <EyeIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleOpenCodeEditor}
          disabled={!generatedCode}
          className="text-[#161413] hover:opacity-70 transition-opacity disabled:opacity-30 p-1"
          title="Open Code Editor"
        >
          <CodeIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleOpenInNewTab}
          disabled={!generatedCode}
          className="text-[#161413] hover:opacity-70 transition-opacity disabled:opacity-30 p-1"
          title="Open in New Tab"
        >
          <ArrowSquareOutIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleRefresh}
          className="text-[#161413] hover:opacity-70 transition-opacity p-1"
          title="Refresh"
        >
          <ArrowsClockwiseIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleFullscreen}
          className="text-[#161413] hover:opacity-70 transition-opacity p-1"
          title="Toggle Fullscreen"
        >
          <CornersOutIcon className="w-6 h-6" />
        </button>

        {/* Export Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!generatedCode}
            className="text-[#161413] hover:opacity-70 transition-opacity disabled:opacity-30 p-1"
            title="Export"
          >
            <FileArchiveIcon className="w-6 h-6" />
          </button>

          {showExportMenu && generatedCode && (
            <div className="absolute top-full right-0 mt-2 bg-white border-[1.4px] border-black rounded-md shadow-lg py-1 min-w-[200px]">
              <button
                onClick={handleExportComponent}
                className="w-full text-left px-4 py-2 text-sm text-[#161413] hover:bg-[#f7f7f7] transition-colors"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                Download Component (.tsx)
              </button>
              <button
                onClick={handleExportProject}
                className="w-full text-left px-4 py-2 text-sm text-[#161413] hover:bg-[#f7f7f7] transition-colors border-t border-gray-200"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                Download Project (.zip)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}
