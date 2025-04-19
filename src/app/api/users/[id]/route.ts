import { extendedPrisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await extendedPrisma.user.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to delete user:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
