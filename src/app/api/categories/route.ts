import { extendedPrisma } from '@/lib/prisma';
import { CategoryType } from '@/types';
import { NextResponse } from 'next/server';

// 디버깅을 위한 값 확인
console.log('API CategoryType values:', Object.values(CategoryType));
console.log('API CategoryType keys:', Object.keys(CategoryType));

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
    const { name, slug, icon, description } = body;

    console.log('Request body:', JSON.stringify(body, null, 2));

    // 기본 카테고리 데이터 - type 필드 제외
    const categoryData = {
      name,
      slug,
      icon,
      description,
      // type 필드 제거
    };

    console.log('Final category data:', JSON.stringify(categoryData, null, 2));

    // 카테고리 생성
    const category = await extendedPrisma.category
      .create({
        data: categoryData,
      })
      .catch((error: any) => {
        console.error('Prisma create error:', error);
        console.error('Error code:', error.code);
        console.error('Error meta:', error.meta);
        throw error;
      });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    console.error(
      'Error details:',
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );

    // 클라이언트에게 더 상세한 오류 정보 제공
    return NextResponse.json(
      {
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
