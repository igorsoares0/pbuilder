import { ThinkingStep } from './conversation';

export interface GenerationRequest {
  prompt: string;
  conversationId?: string;
}

export interface GenerationResponse {
  code: string;
  thinking_steps: ThinkingStep[];
  language: string;
  framework?: string;
  dependencies?: Record<string, string>;
}

export interface StreamChunk {
  type: 'thinking' | 'code' | 'complete' | 'error';
  content: string;
  step?: ThinkingStep;
}

export interface GenerationError {
  message: string;
  code: string;
  details?: unknown;
}
