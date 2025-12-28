import { create } from 'zustand';
import { ThinkingStep } from '@/types/conversation';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinkingSteps?: ThinkingStep[];
  generatedCode?: string;
  createdAt: Date;
}

interface ProjectFiles {
  [path: string]: string;
}

interface GenerationStore {
  // State
  isGenerating: boolean;
  streamingContent: string;
  thinkingSteps: ThinkingStep[];
  currentStep: ThinkingStep | null;
  generatedCode: string | null;
  error: string | null;
  conversationHistory: ConversationMessage[];
  projectFiles: ProjectFiles;
  currentConversationId: string | null;

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
  setConversationHistory: (history: ConversationMessage[]) => void;
  addMessageToHistory: (message: ConversationMessage) => void;
  resetGeneration: () => void;
  updateProjectFile: (path: string, content: string) => void;
  setProjectFiles: (files: ProjectFiles) => void;
  setCurrentConversationId: (id: string | null) => void;
  saveProjectFiles: () => Promise<void>;

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
  conversationHistory: [],
  projectFiles: {},
  currentConversationId: null,

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
  setConversationHistory: (history) => set({ conversationHistory: history }),
  addMessageToHistory: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),
  updateProjectFile: (path, content) =>
    set((state) => ({
      projectFiles: { ...state.projectFiles, [path]: content },
    })),
  setProjectFiles: (files) => set({ projectFiles: files }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  saveProjectFiles: async () => {
    const { currentConversationId, projectFiles } = get();
    if (!currentConversationId) {
      console.error('No conversation ID to save project files');
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${currentConversationId}/files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editedFiles: projectFiles }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project files');
      }

      console.log('✅ Project files saved to database');
    } catch (error) {
      console.error('❌ Error saving project files:', error);
      throw error;
    }
  },
  resetGeneration: () =>
    set({
      isGenerating: false,
      streamingContent: '',
      thinkingSteps: [],
      currentStep: null,
      generatedCode: null,
      error: null,
      conversationHistory: [],
      projectFiles: {},
      currentConversationId: null,
    }),

  // Async actions
  startGeneration: async (prompt: string, conversationId?: string) => {
    console.log('🚀 Starting generation with prompt:', prompt);

    // Set current conversation ID
    if (conversationId) {
      set({ currentConversationId: conversationId });
    }

    // Add user message to history
    const userMessage: ConversationMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };

    set((state) => ({
      conversationHistory: [...state.conversationHistory, userMessage],
      isGenerating: true,
      streamingContent: '',
      thinkingSteps: [],
      currentStep: null,
      generatedCode: null,
      error: null,
    }));

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

              if (data.type === 'text') {
                // Stream text content in real-time
                set((state) => ({
                  streamingContent: state.streamingContent + data.content,
                }));
              } else if (data.type === 'thinking' && data.step) {
                console.log('💭 Adding thinking step:', data.step.title);
                set((state) => ({
                  thinkingSteps: [...state.thinkingSteps, data.step],
                  currentStep: data.step,
                }));
              } else if (data.type === 'complete') {
                console.log('✨ Generation complete! Code length:', data.content?.length);

                // Add assistant message to history
                const assistantMessage: ConversationMessage = {
                  id: `temp-assistant-${Date.now()}`,
                  role: 'assistant',
                  content: get().streamingContent, // Use the full streamed content
                  thinkingSteps: get().thinkingSteps,
                  generatedCode: data.content,
                  createdAt: new Date(),
                };

                set((state) => ({
                  conversationHistory: [...state.conversationHistory, assistantMessage],
                  generatedCode: data.content,
                  isGenerating: false,
                  currentStep: null,
                  streamingContent: '', // Clear streaming content
                }));
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
      conversationHistory: [],
      currentConversationId: conversationId,
    });

    try {
      // Load messages
      const messagesResponse = await fetch(`/api/conversations/${conversationId}/messages`);

      if (!messagesResponse.ok) {
        throw new Error('Failed to load conversation');
      }

      const messages = await messagesResponse.json();
      console.log('📨 Loaded messages:', messages.length);

      // Load conversation details (including editedFiles)
      const conversationResponse = await fetch(`/api/conversations/${conversationId}`);
      const conversationData = await conversationResponse.json();

      // Convert messages to conversation history
      const history: ConversationMessage[] = messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        thinkingSteps: msg.thinkingSteps || undefined,
        generatedCode: msg.generatedCode || undefined,
        createdAt: new Date(msg.createdAt),
      }));

      // Find the last assistant message with generated code for preview
      const lastAssistantMessage = messages
        .reverse()
        .find((msg: any) => msg.role === 'assistant' && msg.generatedCode);

      const editedFiles = conversationData?.editedFiles || {};

      // Use edited version of page.tsx if available, otherwise use original
      const codeForPreview = editedFiles['app/page.tsx'] || lastAssistantMessage?.generatedCode || null;

      set({
        conversationHistory: history,
        generatedCode: codeForPreview,
        thinkingSteps: lastAssistantMessage?.thinkingSteps || [],
        projectFiles: editedFiles,
      });

      console.log('✅ Conversation loaded successfully with edited files:', Object.keys(editedFiles).length);
    } catch (error) {
      console.error('❌ Error loading conversation:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load conversation',
      });
    }
  },
}));

export type { ConversationMessage, ProjectFiles };
