import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/client';

const OLD_MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    console.log('🔄 Starting migration...');
    console.log('   From (old MOCK_USER_ID):', OLD_MOCK_USER_ID);
    console.log('   To (current user):', currentUserId);

    // Count conversations to migrate
    const conversationsToMigrate = await prisma.conversation.count({
      where: { userId: OLD_MOCK_USER_ID },
    });

    console.log('   Conversations to migrate:', conversationsToMigrate);

    if (conversationsToMigrate === 0) {
      return NextResponse.json({
        success: true,
        message: 'No conversations to migrate',
        migratedCount: 0,
      });
    }

    // Migrate conversations
    const result = await prisma.conversation.updateMany({
      where: { userId: OLD_MOCK_USER_ID },
      data: { userId: currentUserId },
    });

    console.log('✅ Migration completed:', result.count, 'conversations migrated');

    // Also migrate messages if needed
    const messagesResult = await prisma.message.updateMany({
      where: { userId: OLD_MOCK_USER_ID },
      data: { userId: currentUserId },
    });

    console.log('✅ Messages migrated:', messagesResult.count);

    return NextResponse.json({
      success: true,
      message: 'Conversations migrated successfully',
      migratedConversations: result.count,
      migratedMessages: messagesResult.count,
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate conversations' },
      { status: 500 }
    );
  }
}
