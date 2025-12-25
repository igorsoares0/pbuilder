'use client';

import { useState } from 'react';
import { useGenerationStore } from '@/store';
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
  const [showCode, setShowCode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
      console.error('Copy error:', error);
    }
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

    const blob = new Blob([generatedCode], { type: 'text/html' });
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
          onClick={handleCopy}
          disabled={!generatedCode}
          className="text-[#161413] hover:opacity-70 transition-opacity disabled:opacity-30 p-1"
          title="Copy Code"
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
