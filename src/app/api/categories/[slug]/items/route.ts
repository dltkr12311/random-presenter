import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/categories/[slug]/items - 카테고리의 모든 아이템 조회
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;

    // 먼저 카테고리 ID 찾기
    const category = await extendedPrisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 카테고리에 속한 아이템 조회
    const items = await extendedPrisma.item.findMany({
      where: { categoryId: category.id },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/categories/[slug]/items - 카테고리에 새 아이템 추가
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;

    // 요청 본문 파싱 시 오류 처리 강화
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // 필수 필드 검증
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // 먼저 카테고리 ID 찾기
    const category = await extendedPrisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 새 아이템 생성
    const item = await extendedPrisma.item.create({
      data: {
        name: body.name,
        imageUrl: body.imageUrl || '/default-avatar.png',
        categoryId: category.id,
        selected: false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
