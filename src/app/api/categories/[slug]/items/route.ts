import { extendedPrisma } from '@/lib/prisma';
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
    if (category.type === 'food') {
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
    console.log('Creating item for category:', params.slug, 'with data:', {
      name,
      imageUrl: imageUrl || '/default-avatar.png',
      categoryId: category.id,
    });

    const item = await extendedPrisma.item
      .create({
        data: {
          name,
          imageUrl: imageUrl || '/default-avatar.png',
          categoryId: category.id,
        },
      })
      .catch((error: any) => {
        console.error('Error creating item:', error);
        console.error('Error code:', error.code);
        console.error('Error meta:', error.meta);
        throw new Error(`Item creation failed: ${error.message}`);
      });

    // 카테고리 타입에 따른 추가 처리
    if (category.type === 'food') {
      // 음식 카테고리인 경우 FoodEntry도 생성
      const { foodType, priceRange, location, address, rating, tags } = body;

      console.log('Creating food entry for item:', item.id, 'with data:', {
        foodType: foodType || '기타',
        priceRange: priceRange || '보통',
      });

      const foodEntry = await extendedPrisma.foodEntry
        .create({
          data: {
            itemId: item.id,
            categoryId: category.id,
            foodType: foodType || '기타',
            priceRange: priceRange || '보통',
            location: location || '',
            address: address || '',
            rating: rating || null,
            tags: tags || [],
          },
        })
        .catch((error: any) => {
          console.error('Error creating food entry:', error);
          console.error('Error code:', error.code);
          console.error('Error meta:', error.meta);
          throw new Error(`Food entry creation failed: ${error.message}`);
        });

      // FoodEntry 정보를 포함하여 반환
      return NextResponse.json({
        ...item,
        foodEntry,
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in POST /api/categories/[slug]/items:', error);
    console.error(
      'Error details:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: 'Failed to create item',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
