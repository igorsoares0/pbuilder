'use client';

import { useState } from 'react';
import { ThinkingStep as ThinkingStepType } from '@/types/conversation';

interface ThinkingStepProps {
  step: ThinkingStepType;
}

export function ThinkingStep({ step }: ThinkingStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const statusIcon = {
    pending: (
      <div className="w-3 h-3 border-2 border-gray-400 rounded-full" />
    ),
    in_progress: (
      <div className="w-3 h-3 border-2 border-[#f27b2f] border-t-transparent rounded-full animate-spin" />
    ),
    complete: (
      <svg className="w-3 h-3 text-[#f27b2f]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="mb-4">
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 mt-1">
          {statusIcon[step.status]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {step.title}
          </div>
        </div>
      </div>

      {isExpanded && step.content && (
        <div className="ml-5">
          <div className="text-sm text-[#161413] whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {step.content}
          </div>
        </div>
      )}
    </div>
  );
}
