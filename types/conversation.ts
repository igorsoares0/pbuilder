// Re-export Prisma types
export type { User, Conversation, Message, Artifact } from '@prisma/client';

// Custom types that extend Prisma types
export interface ThinkingStep {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in_progress' | 'complete';
  timestamp?: Date;
}
