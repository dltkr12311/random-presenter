import { extendedPrisma } from '@/lib/prisma';
import { CategoryType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/categories/[slug]/items
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 카테고리 찾기
    const category = await extendedPrisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 카테고리 타입에 따라 추가 데이터 로드
    let enrichedItems = category.items;

    // 음식 카테고리인 경우 FoodEntry 정보도 가져오기
    if (category.type === CategoryType.FOOD) {
      // 각 item에 대한 foodEntry 정보 가져오기
      const itemsWithFoodEntries = await Promise.all(
        category.items.map(async (item: any) => {
          const foodEntry = await extendedPrisma.foodEntry.findUnique({
            where: { itemId: item.id },
          });

          return {
            ...item,
            foodEntry: foodEntry || null,
          };
        })
      );

      enrichedItems = itemsWithFoodEntries;
    }

    return NextResponse.json(enrichedItems);
  } catch (error) {
    console.error('Error retrieving items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve items' },
      { status: 500 }
    );
  }
}

// POST /api/categories/[slug]/items
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { name, imageUrl } = body;

    // 카테고리 찾기
    const category = await extendedPrisma.category.findUnique({
      where: { slug: params.slug },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 기본 아이템 생성
    const item = await extendedPrisma.item.create({
      data: {
        name,
        imageUrl: imageUrl || '/default-avatar.png',
        categoryId: category.id,
      },
    });

    // 카테고리 타입에 따른 추가 처리
    if (category.type === CategoryType.FOOD) {
      // 음식 카테고리인 경우 FoodEntry도 생성
      const { foodType, priceRange, location, address, rating, tags } = body;

      const foodEntry = await extendedPrisma.foodEntry.create({
        data: {
          itemId: item.id,
          categoryId: category.id,
          foodType,
          priceRange,
          location,
          address,
          rating,
          tags: tags || [],
        },
      });

      // FoodEntry 정보를 포함하여 반환
      return NextResponse.json({
        ...item,
        foodEntry,
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
