import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/categories - 모든 카테고리 조회
export async function GET() {
  try {
    const categories = await extendedPrisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - 새 카테고리 추가
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // slug 생성 - 안전한 URL 생성을 위해 특수문자 제거 및 필터링
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .trim()
        // 특수문자를 하이픈이나 빈 문자열로 대체
        .replace(/[^\w\s-]/g, '') // 알파벳, 숫자, 하이픈, 공백 외 모든 문자 제거
        .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
        .replace(/-+/g, '-'); // 연속된 하이픈을 하나로 변환

    const category = await extendedPrisma.category.create({
      data: {
        name: body.name,
        slug: slug,
        icon: body.icon || null,
        description: body.description || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
