'use client';

import { useState, FormEvent } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ArrowUpIcon } from '@/components/ui/Icons';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Redirect to chat with the prompt
    router.push(`/chat?prompt=${encodeURIComponent(input)}`);
  };

  return (
    <div className="min-h-screen bg-[#f0efeb]">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-end gap-4 px-8 py-6">
          <button className="px-4 py-2 bg-[#f27b2f] border-[1.4px] border-black rounded-md font-semibold text-sm text-[#161413] hover:bg-[#e06a1f] transition-colors">
            Upgrade
          </button>
          <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
            You have 80 credits.
          </span>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-8 pb-20">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl font-semibold text-center mb-12 text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
              What do you want to create?
            </h1>

            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask to build something..."
                className="w-full h-32 px-6 py-4 pb-16 bg-white border-[1.4px] border-[#161413] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#f27b2f] text-base"
                style={{ fontFamily: 'Geist Mono, monospace' }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute bottom-4 right-4 w-12 h-12 bg-[#f27b2f] border-[1.4px] border-black rounded-md flex items-center justify-center text-white hover:bg-[#e06a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpIcon className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
