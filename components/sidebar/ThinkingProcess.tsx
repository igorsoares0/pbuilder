'use client';

import { useEffect, useRef } from 'react';
import { useGenerationStore } from '@/store';
import { ThinkingStep } from './ThinkingStep';
import { BrainIcon } from '@/components/ui/Icons';

export function ThinkingProcess() {
  const { conversationHistory, thinkingSteps, isGenerating, streamingContent } = useGenerationStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory, thinkingSteps, streamingContent]);

  if (conversationHistory.length === 0 && !isGenerating) {
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
    <div ref={scrollRef} className="h-full overflow-y-auto px-6 py-4 space-y-4">
      {conversationHistory.map((message) => (
        <div key={message.id}>
          {/* User Message */}
          {message.role === 'user' && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#f27b2f] mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
                YOU
              </div>
              <div className="bg-[#f7f7f7] border-[1.4px] border-[#161413] rounded-md p-3">
                <p className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                  {message.content}
                </p>
              </div>
            </div>
          )}

          {/* Assistant Message */}
          {message.role === 'assistant' && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#161413] mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
                AI ASSISTANT
              </div>

              {/* Thinking Steps */}
              {message.thinkingSteps && message.thinkingSteps.length > 0 && (
                <div className="space-y-2 mb-3">
                  {message.thinkingSteps.map((step) => (
                    <ThinkingStep key={step.id} step={step} />
                  ))}
                </div>
              )}

              {/* Code Generated Indicator */}
              {message.generatedCode && (
                <div className="bg-[#e5f5e5] border-[1.4px] border-[#161413] rounded-md p-2">
                  <p className="text-xs text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
                    ✓ Code generated ({message.generatedCode.length} chars)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Current generation in progress */}
      {isGenerating && (
        <div>
          <div className="text-xs font-semibold text-[#161413] mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
            AI ASSISTANT
            <span className="ml-2 inline-flex items-center">
              <span className="animate-pulse">●</span>
            </span>
          </div>

          {/* Thinking Steps */}
          {thinkingSteps.length > 0 && (
            <div className="space-y-2 mb-3">
              {thinkingSteps.map((step) => (
                <ThinkingStep key={step.id} step={step} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
