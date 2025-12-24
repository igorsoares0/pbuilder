import { ThinkingStep } from '@/types/conversation';

export interface ParsedChunk {
  type: 'thinking' | 'code' | 'complete' | 'error';
  content: string;
  step?: ThinkingStep;
}

export function parseThinkingSteps(content: string): ThinkingStep[] {
  const steps: ThinkingStep[] = [];
  const sections = content.split(/^## /gm).filter(Boolean);

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();

    // Skip the "Generated Code" section as it's not a thinking step
    if (title.toLowerCase().includes('generated code')) {
      continue;
    }

    const contentLines = lines.slice(1).join('\n').trim();

    steps.push({
      id: crypto.randomUUID(),
      title,
      content: contentLines,
      status: 'complete',
      timestamp: new Date(),
    });
  }

  return steps;
}

export function extractCode(content: string): string | null {
  // Match code blocks with triple backticks - support tsx, jsx, javascript, html
  const codeBlockRegex = /```(?:tsx|jsx|typescript|javascript|js|html)?\n([\s\S]*?)```/g;
  const matches = [...content.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    // Get the last (and usually largest) code block
    return matches[matches.length - 1][1].trim();
  }

  // If no code block found, check if there's an HTML-like structure
  const htmlRegex = /<!DOCTYPE html>[\s\S]*<\/html>/i;
  const htmlMatch = content.match(htmlRegex);

  if (htmlMatch) {
    return htmlMatch[0].trim();
  }

  // Check for React component pattern
  const reactRegex = /export default function \w+[\s\S]*?^}/gm;
  const reactMatch = content.match(reactRegex);

  if (reactMatch) {
    return reactMatch[0].trim();
  }

  return null;
}

export function detectLanguageAndFramework(code: string): {
  language: string;
  framework?: string;
} {
  // Check for React/Next.js patterns
  if (code.includes('export default function') ||
      code.includes('useState') ||
      code.includes('useEffect') ||
      code.includes('use client')) {
    return {
      language: 'typescript',
      framework: code.includes('use client') || code.includes('use server') ? 'nextjs' : 'react'
    };
  }

  // Check for JSX/TSX
  if (code.includes('import React') ||
      code.includes('from "react"') ||
      code.includes('from \'react\'')) {
    return { language: 'typescript', framework: 'react' };
  }

  // Check for HTML
  if (code.includes('<!DOCTYPE html>') || code.includes('<html')) {
    return { language: 'html' };
  }

  // Check for Vue
  if (code.includes('import Vue') || code.includes('from "vue"')) {
    return { language: 'javascript', framework: 'vue' };
  }

  // Default to JavaScript/React if it has JSX-like syntax
  if (code.includes('<') && code.includes('>') && code.includes('className')) {
    return { language: 'javascript', framework: 'react' };
  }

  return { language: 'javascript' };
}
