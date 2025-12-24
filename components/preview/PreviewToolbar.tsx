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

export function PreviewToolbar() {
  const { generatedCode } = useGenerationStore();
  const [showCode, setShowCode] = useState(false);

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

  const handleExport = async () => {
    if (!generatedCode) return;

    try {
      const blob = new Blob([generatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-app-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Code exported successfully!');
    } catch (error) {
      toast.error('Failed to export code');
      console.error('Export error:', error);
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
        <button
          onClick={handleExport}
          disabled={!generatedCode}
          className="text-[#161413] hover:opacity-70 transition-opacity disabled:opacity-30 p-1"
          title="Export"
        >
          <FileArchiveIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
