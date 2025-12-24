'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { ChatInput } from '@/components/sidebar/ChatInput';
import { ThinkingProcess } from '@/components/sidebar/ThinkingProcess';
import { UserInfo } from '@/components/sidebar/UserInfo';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { PreviewToolbar } from '@/components/preview/PreviewToolbar';
import { useGenerationStore } from '@/store';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { generatedCode, startGeneration, loadConversation, resetGeneration } = useGenerationStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessedPrompt = useRef(false);
  const loadedConversationId = useRef<string | null>(null);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    const conversationId = searchParams.get('conversationId');

    // Case 0: No conversationId and no prompt = New Chat
    if (!conversationId && !prompt) {
      loadedConversationId.current = null;
      hasProcessedPrompt.current = false;
      resetGeneration();
      return;
    }

    // Case 1: User clicked on existing conversation (has conversationId, no prompt)
    if (conversationId && !prompt && loadedConversationId.current !== conversationId) {
      loadedConversationId.current = conversationId;
      hasProcessedPrompt.current = false;
      loadConversation(conversationId);
      return;
    }

    // Case 2: User submitted a new prompt (has prompt)
    if (prompt && !hasProcessedPrompt.current) {
      hasProcessedPrompt.current = true;
      loadedConversationId.current = null;

      const handlePromptGeneration = async () => {
        let currentConversationId = conversationId;

        // Create conversation if none exists
        if (!currentConversationId) {
          try {
            const response = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: prompt.substring(0, 100) }),
            });

            if (response.ok) {
              const newConversation = await response.json();
              currentConversationId = newConversation.id;
              // Update URL with conversationId
              router.replace(`/chat?conversationId=${currentConversationId}`);
            } else {
              toast.error('Failed to create conversation');
              return;
            }
          } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Failed to create conversation');
            return;
          }
        }

        // Start generation with conversationId
        await startGeneration(prompt, currentConversationId || undefined);
      };

      handlePromptGeneration();
    }
  }, [searchParams, startGeneration, loadConversation, router]);

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
