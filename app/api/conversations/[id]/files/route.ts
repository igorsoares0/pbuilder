import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { editedFiles } = await request.json();

    // Update the conversation with edited files
    await prisma.conversation.update({
      where: { id },
      data: {
        editedFiles: editedFiles || {},
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating edited files:', error);
    return NextResponse.json(
      { error: 'Failed to update edited files' },
      { status: 500 }
    );
  }
}
