import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/categories/[slug]/items/[id] - 특정 아이템 조회
export async function GET(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    // 카테고리 확인
    const category = await extendedPrisma.category.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 아이템 조회
    const item = await extendedPrisma.item.findUnique({
      where: { id: params.id },
    });

    if (!item || item.categoryId !== category.id) {
      return NextResponse.json(
        { error: 'Item not found in this category' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to fetch item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[slug]/items/[id] - 아이템 업데이트
export async function PUT(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const body = await request.json();

    // 카테고리 확인
    const category = await extendedPrisma.category.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 아이템 존재 여부 확인
    const existingItem = await extendedPrisma.item.findUnique({
      where: { id: params.id },
    });

    if (!existingItem || existingItem.categoryId !== category.id) {
      return NextResponse.json(
        { error: 'Item not found in this category' },
        { status: 404 }
      );
    }

    // 아이템 업데이트
    const updatedItem = await extendedPrisma.item.update({
      where: { id: params.id },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
        selected:
          body.selected !== undefined ? body.selected : existingItem.selected,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[slug]/items/[id] - 아이템 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    // 카테고리 확인
    const category = await extendedPrisma.category.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 아이템 존재 여부 확인
    const existingItem = await extendedPrisma.item.findUnique({
      where: { id: params.id },
    });

    if (!existingItem || existingItem.categoryId !== category.id) {
      return NextResponse.json(
        { error: 'Item not found in this category' },
        { status: 404 }
      );
    }

    // 아이템 삭제
    await extendedPrisma.item.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
