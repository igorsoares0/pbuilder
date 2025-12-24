'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ThinkingProcess } from '@/components/sidebar/ThinkingProcess';
import { UserInfo } from '@/components/sidebar/UserInfo';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { PreviewToolbar } from '@/components/preview/PreviewToolbar';
import { useGenerationStore } from '@/store';

export default function HomePage() {
  const { generatedCode } = useGenerationStore();

  return (
    <>
      <Header />
      <Sidebar>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ThinkingProcess />
        </div>

        {/* Chat Input */}
        <ChatInput />

        {/* User Info */}
        <UserInfo />
      </Sidebar>

      <MainContent>
        <div className="relative h-full">
          <PreviewToolbar />
          <div className="h-full p-8 pt-20">
            <div className="h-full border-[1.4px] border-[#161413] bg-white rounded-sm overflow-hidden">
              <PreviewFrame code={generatedCode || ''} />
            </div>
          </div>
        </div>
      </MainContent>
    </>
  );
}
