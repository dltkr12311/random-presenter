import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: { id: string };
};

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Failed to delete user:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
