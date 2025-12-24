'use client';

import { Conversation } from '@/types/conversation';
import { useConversationStore } from '@/store';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const { selectConversation, deleteConversation } = useConversationStore();

  const handleClick = () => {
    selectConversation(conversation.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversation.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative p-4 cursor-pointer transition-colors
        ${isActive ? 'bg-orange-50 border-l-2 border-orange-500' : 'hover:bg-gray-100'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium truncate ${isActive ? 'text-orange-900' : 'text-gray-900'}`}>
            {conversation.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(conversation.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
          title="Delete conversation"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
