'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { useGenerationStore, useConversationStore } from '@/store';
import { ArrowUpIcon } from '@/components/ui/Icons';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { isGenerating, startGeneration } = useGenerationStore();
  const { currentConversation } = useConversationStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const prompt = input.trim();
    setInput('');

    await startGeneration(prompt, currentConversation?.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          disabled={isGenerating}
          className="w-full px-4 py-3 pb-14 bg-[#f7f7f7] border-[1.4px] border-[#161413] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 text-sm"
          style={{ fontFamily: 'Geist Mono, monospace' }}
          rows={4}
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute bottom-3 right-3 w-10 h-10 bg-[#f27b2f] border-[1.4px] border-black rounded-md flex items-center justify-center text-white hover:bg-[#e06a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <ArrowUpIcon className="w-5 h-5" />
          )}
        </button>
      </form>
      <p className="text-xs text-[#161413] mt-2 ml-1" style={{ fontFamily: 'Geist, sans-serif' }}>
        You have 80 credits.
      </p>
    </div>
  );
}
