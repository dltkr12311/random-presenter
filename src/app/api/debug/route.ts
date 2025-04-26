import { extendedPrisma } from '@/lib/prisma';
import { CategoryType } from '@/types';
import { NextResponse } from 'next/server';

// GET /api/debug - 디버그 정보 조회
export async function GET() {
  try {
    // 타입 정보 출력
    const categoryTypeValues = Object.values(CategoryType);
    const categoryTypeKeys = Object.keys(CategoryType);

    // 프리즈마 스키마 구조 조회
    const prismaCategories = await extendedPrisma.category.findMany({
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    // 모든 정보 반환
    return NextResponse.json({
      categoryType: {
        values: categoryTypeValues,
        keys: categoryTypeKeys,
        rawEnum: CategoryType,
      },
      prismaSchema: {
        categories: prismaCategories,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug error', details: String(error) },
      { status: 500 }
    );
  }
}
