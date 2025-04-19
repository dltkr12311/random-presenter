import { extendedPrisma } from '@/lib/prisma';
import { CategoryType } from '@/types';
import { featuresArrayToJson, getDefaultFeatures } from '@/utils/categoryUtils';
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
    const { name, slug, icon, description, type } = body;

    // 카테고리 타입 파악 (지정되지 않으면 기본값으로 GENERAL 사용)
    const categoryType = type
      ? Object.values(CategoryType).includes(type as CategoryType)
        ? (type as CategoryType)
        : CategoryType.GENERAL
      : CategoryType.GENERAL;

    // 타입에 따른 기본 기능 설정
    const defaultFeatures = getDefaultFeatures(categoryType);

    // 카테고리 생성
    const category = await extendedPrisma.category.create({
      data: {
        name,
        slug,
        icon,
        description,
        type: categoryType,
        features: featuresArrayToJson(defaultFeatures),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
