'use client';

import { useState, useEffect } from 'react';
import { XIcon } from '@/components/ui/Icons';
import { useUIStore, useGenerationStore } from '@/store';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  code: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path?: string;
}

export function CodeEditor({ code }: CodeEditorProps) {
  const { toggleCodeEditor } = useUIStore();
  const { projectFiles, updateProjectFile, setProjectFiles, setGeneratedCode } = useGenerationStore();
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState('app/page.tsx');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['app', 'components']));
  const [hasChanges, setHasChanges] = useState(false);

  // Default file contents
  const defaultFileContents: Record<string, string> = {
    'app/page.tsx': code,
    'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Generated App',
  description: 'Generated with AI Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
    'package.json': `{
  "name": "ai-generated-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}`,
    'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
    'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config`,
    'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`,
  };

  // Initialize project files if empty
  useEffect(() => {
    if (Object.keys(projectFiles).length === 0) {
      setProjectFiles(defaultFileContents);
    }
  }, []);

  // Get current file content from store or default
  const currentFileContent = projectFiles[selectedFile] || defaultFileContents[selectedFile] || '// File content not available';
  const [editedCode, setEditedCode] = useState(currentFileContent);

  // Update editedCode when selectedFile changes
  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    const content = projectFiles[path] || defaultFileContents[path] || '// File content not available';
    setEditedCode(content);
  };

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setEditedCode(newCode);
    setHasChanges(true);
  };

  // Apply changes to store
  const handleApplyChanges = () => {
    updateProjectFile(selectedFile, editedCode);

    // If editing page.tsx, also update the main generatedCode for preview
    if (selectedFile === 'app/page.tsx') {
      setGeneratedCode(editedCode);
    }

    setHasChanges(false);
    toast.success('Changes applied successfully!');
  };

  // Create file tree structure
  const fileTree: FileNode[] = [
    {
      name: 'app',
      type: 'folder',
      children: [
        { name: 'page.tsx', type: 'file', path: 'app/page.tsx' },
        { name: 'layout.tsx', type: 'file', path: 'app/layout.tsx' },
        { name: 'globals.css', type: 'file', path: 'app/globals.css' },
      ]
    },
    {
      name: 'components',
      type: 'folder',
      children: [
        { name: 'ui', type: 'folder', children: [] }
      ]
    },
    { name: 'package.json', type: 'file', path: 'package.json' },
    { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
    { name: 'tailwind.config.ts', type: 'file', path: 'tailwind.config.ts' },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
      console.error('Copy error:', error);
    }
  };

  const getFileType = (path: string) => {
    if (path.endsWith('.tsx')) return 'TypeScript React';
    if (path.endsWith('.ts')) return 'TypeScript';
    if (path.endsWith('.json')) return 'JSON';
    if (path.endsWith('.css')) return 'CSS';
    return 'Text';
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (nodes: FileNode[], parentPath = '') => {
    return nodes.map((node) => {
      const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(fullPath);
      const isSelected = selectedFile === node.path;

      if (node.type === 'folder') {
        return (
          <div key={fullPath}>
            <div
              onClick={() => toggleFolder(fullPath)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 cursor-pointer group"
            >
              <span className="text-[#161413] text-sm" style={{ fontFamily: 'Geist Mono, monospace' }}>
                {isExpanded ? '▼' : '▶'}
              </span>
              <span className="text-[#161413] text-sm" style={{ fontFamily: 'Geist Mono, monospace' }}>
                📁 {node.name}
              </span>
            </div>
            {isExpanded && node.children && (
              <div className="ml-4">
                {renderFileTree(node.children, fullPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={fullPath}
          onClick={() => node.path && handleFileSelect(node.path)}
          className={`flex items-center gap-2 px-3 py-1.5 hover:bg-gray-200 cursor-pointer ${
            isSelected ? 'bg-[#f27b2f]/10 border-l-2 border-[#f27b2f]' : ''
          }`}
        >
          <span className="ml-6 text-[#161413] text-sm" style={{ fontFamily: 'Geist Mono, monospace' }}>
            📄 {node.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b-[1.4px] border-[#161413]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
            Code Editor
          </h2>
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {selectedFile}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleApplyChanges}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Apply Changes
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#f27b2f] text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={toggleCodeEditor}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            title="Close"
          >
            <XIcon className="w-5 h-5 text-[#161413]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-64 border-r-[1.4px] border-[#161413] bg-white overflow-y-auto">
          <div className="px-3 py-2 border-b-[1.4px] border-[#161413] bg-[#f7f7f7]">
            <h3 className="text-xs font-bold text-[#161413] uppercase" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Files
            </h3>
          </div>
          <div className="py-2">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Tab Bar */}
          <div className="flex items-center border-b-[1.4px] border-[#161413] bg-[#f7f7f7]">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-r-[1.4px] border-[#161413]">
              <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
                {selectedFile.split('/').pop()}
              </span>
            </div>
          </div>

          {/* Line Numbers + Code */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div className="w-12 bg-[#f7f7f7] border-r-[1.4px] border-[#161413] overflow-hidden">
              <div className="py-4 px-2 text-right">
                {editedCode.split('\n').map((_, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-500 leading-6"
                    style={{ fontFamily: 'Geist Mono, monospace' }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 overflow-auto">
              <textarea
                value={editedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm text-[#161413] resize-none focus:outline-none bg-white"
                style={{
                  fontFamily: 'Geist Mono, monospace',
                  tabSize: 2,
                  lineHeight: '1.5rem',
                  minHeight: '100%'
                }}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-6 py-2 border-t-[1.4px] border-[#161413] bg-[#f7f7f7] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
            Lines: {editedCode.split('\n').length}
          </span>
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Geist Mono, monospace' }}>
            Characters: {editedCode.length}
          </span>
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {getFileType(selectedFile)}
          </span>
        </div>
        <button
          onClick={toggleCodeEditor}
          className="px-3 py-1 text-xs border-[1.4px] border-[#161413] rounded-md hover:bg-gray-200 transition-colors font-medium"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          Close Editor
        </button>
      </div>
    </div>
  );
}
