import { prisma } from './client';
import { Conversation, Message, Artifact, User } from '@prisma/client';

// Mock user ID for development
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// User queries
export async function getUser(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  provider?: string;
}): Promise<User | null> {
  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.password,
        credits: 80, // Initial credits
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getMockUser(): Promise<User | null> {
  return getUser(MOCK_USER_ID);
}

// Conversation queries
export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
}

export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    return await prisma.conversation.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    return null;
  }
}

export async function createConversation(
  userId: string,
  title: string
): Promise<Conversation | null> {
  try {
    return await prisma.conversation.create({
      data: {
        userId,
        title,
      },
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}

export async function updateConversation(
  id: string,
  data: { title?: string; status?: string }
): Promise<Conversation | null> {
  try {
    return await prisma.conversation.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return null;
  }
}

export async function deleteConversation(id: string): Promise<boolean> {
  try {
    await prisma.conversation.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

// Message queries
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

export async function createMessage(data: {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  thinkingSteps?: unknown;
  generatedCode?: string;
}): Promise<Message | null> {
  try {
    return await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: data.role,
        content: data.content,
        thinkingSteps: data.thinkingSteps as any,
        generatedCode: data.generatedCode,
      },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
}

// Artifact queries
export async function createArtifact(data: {
  conversationId: string;
  messageId: string;
  code: string;
  language: string;
  framework?: string;
  dependencies?: Record<string, string>;
}): Promise<Artifact | null> {
  try {
    return await prisma.artifact.create({
      data: {
        conversationId: data.conversationId,
        messageId: data.messageId,
        code: data.code,
        language: data.language,
        framework: data.framework,
        dependencies: data.dependencies as any,
      },
    });
  } catch (error) {
    console.error('Error creating artifact:', error);
    return null;
  }
}

export async function getArtifacts(conversationId: string): Promise<Artifact[]> {
  try {
    return await prisma.artifact.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error getting artifacts:', error);
    return [];
  }
}
