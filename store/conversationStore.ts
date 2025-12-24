import { create } from 'zustand';
import { Conversation, Message } from '@/types/conversation';

interface ConversationStore {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (isLoading: boolean) => void;

  // Async actions
  loadConversations: () => Promise<void>;
  createConversation: (title: string) => Promise<Conversation | null>;
  selectConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,

  // Sync actions
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),

  // Async actions
  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const conversations = await response.json();
        set({ conversations });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createConversation: async (title: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const conversation = await response.json();
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversation: conversation,
        }));
        return conversation;
      }
      return null;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      return null;
    }
  },

  selectConversation: async (id: string) => {
    set({ isLoading: true });
    try {
      const [conversationRes, messagesRes] = await Promise.all([
        fetch(`/api/conversations/${id}`),
        fetch(`/api/conversations/${id}/messages`),
      ]);

      if (conversationRes.ok && messagesRes.ok) {
        const conversation = await conversationRes.json();
        const messages = await messagesRes.json();
        set({ currentConversation: conversation, messages });
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteConversation: async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversation:
            state.currentConversation?.id === id ? null : state.currentConversation,
          messages: state.currentConversation?.id === id ? [] : state.messages,
        }));
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  },
}));
