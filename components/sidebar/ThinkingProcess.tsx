'use client';

import { useEffect, useRef } from 'react';
import { useGenerationStore } from '@/store';
import { ThinkingStep } from './ThinkingStep';
import { BrainIcon } from '@/components/ui/Icons';

export function ThinkingProcess() {
  const { thinkingSteps, isGenerating } = useGenerationStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thinkingSteps]);

  if (thinkingSteps.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <BrainIcon className="w-6 h-6 text-[#f27b2f] mb-4" />
        <p className="text-[#161413] text-sm" style={{ fontFamily: 'Geist Mono, monospace' }}>
          Start a conversation to see AI thinking process
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-6 py-4">
      {thinkingSteps.map((step) => (
        <ThinkingStep key={step.id} step={step} />
      ))}
    </div>
  );
}
