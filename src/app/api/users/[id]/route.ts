import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: {
        id: context.params.id,
      },
    });

    return Response.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
