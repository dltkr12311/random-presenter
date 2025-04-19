import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/categories/[slug] - 특정 카테고리 조회
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;

    const category = await extendedPrisma.category.findUnique({
      where: { slug },
      include: {
        items: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[slug] - 카테고리 업데이트
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;
    const body = await request.json();

    const category = await extendedPrisma.category.update({
      where: { slug },
      data: {
        name: body.name,
        icon: body.icon,
        description: body.description,
        // slug는 변경하지 않음 (URL 안정성 유지)
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[slug] - 카테고리 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;

    await extendedPrisma.category.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
