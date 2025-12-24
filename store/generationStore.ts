import { create } from 'zustand';
import { ThinkingStep } from '@/types/conversation';

interface GenerationStore {
  // State
  isGenerating: boolean;
  streamingContent: string;
  thinkingSteps: ThinkingStep[];
  currentStep: ThinkingStep | null;
  generatedCode: string | null;
  error: string | null;

  // Actions
  setGenerating: (isGenerating: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  setThinkingSteps: (steps: ThinkingStep[]) => void;
  addThinkingStep: (step: ThinkingStep) => void;
  updateThinkingStep: (id: string, updates: Partial<ThinkingStep>) => void;
  setCurrentStep: (step: ThinkingStep | null) => void;
  setGeneratedCode: (code: string | null) => void;
  setError: (error: string | null) => void;
  resetGeneration: () => void;

  // Async actions
  startGeneration: (prompt: string, conversationId?: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
}

export const useGenerationStore = create<GenerationStore>((set, get) => ({
  // Initial state
  isGenerating: false,
  streamingContent: '',
  thinkingSteps: [],
  currentStep: null,
  generatedCode: null,
  error: null,

  // Sync actions
  setGenerating: (isGenerating) => set({ isGenerating }),
  setStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  setThinkingSteps: (steps) => set({ thinkingSteps: steps }),
  addThinkingStep: (step) =>
    set((state) => ({ thinkingSteps: [...state.thinkingSteps, step] })),
  updateThinkingStep: (id, updates) =>
    set((state) => ({
      thinkingSteps: state.thinkingSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),
  setCurrentStep: (step) => set({ currentStep: step }),
  setGeneratedCode: (code) => {
    console.log('🎨 Setting generated code:', code?.substring(0, 100));
    set({ generatedCode: code });
  },
  setError: (error) => set({ error }),
  resetGeneration: () =>
    set({
      isGenerating: false,
      streamingContent: '',
      thinkingSteps: [],
      currentStep: null,
      generatedCode: null,
      error: null,
    }),

  // Async actions
  startGeneration: async (prompt: string, conversationId?: string) => {
    console.log('🚀 Starting generation with prompt:', prompt);
    set({
      isGenerating: true,
      streamingContent: '',
      thinkingSteps: [],
      currentStep: null,
      generatedCode: null,
      error: null,
    });

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, conversationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('✅ Stream completed');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('📦 Received data:', data.type, data);

              if (data.type === 'thinking' && data.step) {
                console.log('💭 Adding thinking step:', data.step.title);
                set((state) => ({
                  thinkingSteps: [...state.thinkingSteps, data.step],
                  currentStep: data.step,
                }));
              } else if (data.type === 'code') {
                set((state) => ({
                  streamingContent: state.streamingContent + data.content,
                }));
              } else if (data.type === 'complete') {
                console.log('✨ Generation complete! Code length:', data.content?.length);
                set({
                  generatedCode: data.content,
                  isGenerating: false,
                  currentStep: null,
                });
              } else if (data.type === 'error') {
                console.error('❌ Error from API:', data.content);
                set({
                  error: data.content,
                  isGenerating: false,
                });
              }
            } catch (e) {
              console.error('Failed to parse stream chunk:', e, 'Line:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isGenerating: false,
      });
    }
  },

  // Load existing conversation
  loadConversation: async (conversationId: string) => {
    console.log('📖 Loading conversation:', conversationId);
    set({
      isGenerating: false,
      streamingContent: '',
      thinkingSteps: [],
      currentStep: null,
      generatedCode: null,
      error: null,
    });

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);

      if (!response.ok) {
        throw new Error('Failed to load conversation');
      }

      const messages = await response.json();
      console.log('📨 Loaded messages:', messages.length);

      // Find the last assistant message with generated code
      const lastAssistantMessage = messages
        .reverse()
        .find((msg: any) => msg.role === 'assistant' && msg.generatedCode);

      if (lastAssistantMessage) {
        // Load thinking steps if available
        if (lastAssistantMessage.thinkingSteps) {
          const steps = Array.isArray(lastAssistantMessage.thinkingSteps)
            ? lastAssistantMessage.thinkingSteps
            : [];
          set({ thinkingSteps: steps });
        }

        // Load generated code
        if (lastAssistantMessage.generatedCode) {
          set({ generatedCode: lastAssistantMessage.generatedCode });
        }
      }

      console.log('✅ Conversation loaded successfully');
    } catch (error) {
      console.error('❌ Error loading conversation:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load conversation',
      });
    }
  },
}));
