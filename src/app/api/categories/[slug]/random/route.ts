import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/categories/[slug]/random - 카테고리 내에서 랜덤 아이템 선정
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // params를 먼저 await 처리
    const { slug } = await params;

    // 카테고리 찾기
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

    // 현재 활성화된 사이클 확인
    let cycle = await extendedPrisma.cycle.findFirst({
      where: {
        categoryId: category.id,
        isActive: true,
      },
    });

    // 활성화된 사이클이 없으면 새로 생성
    if (!cycle) {
      cycle = await extendedPrisma.cycle.create({
        data: {
          categoryId: category.id,
          startDate: new Date(),
        },
      });
    }

    // 아직 선택되지 않은 아이템 중에서 랜덤 선택
    const unselectedItems = await extendedPrisma.item.findMany({
      where: {
        categoryId: category.id,
        selected: false,
      },
    });

    // 모든 아이템이 선택되었다면 새로운 사이클 시작
    if (unselectedItems.length === 0) {
      // 이전 사이클 종료
      await extendedPrisma.cycle.update({
        where: { id: cycle.id },
        data: { isActive: false, endDate: new Date() },
      });

      // 새 사이클 시작
      cycle = await extendedPrisma.cycle.create({
        data: {
          categoryId: category.id,
          startDate: new Date(),
        },
      });

      // 모든 아이템 리셋
      await extendedPrisma.item.updateMany({
        where: { categoryId: category.id },
        data: { selected: false, lastSelectedAt: null },
      });

      // 다시 선택되지 않은 아이템 조회
      const resetItems = await extendedPrisma.item.findMany({
        where: { categoryId: category.id },
      });

      // 이제 모든 아이템이 리셋되었으므로, 이 중에서 랜덤 선택
      const randomIndex = Math.floor(Math.random() * resetItems.length);
      const selectedItem = resetItems[randomIndex];

      // 선택된 아이템 업데이트
      await extendedPrisma.item.update({
        where: { id: selectedItem.id },
        data: {
          selected: true,
          lastSelectedAt: new Date(),
        },
      });

      return NextResponse.json(selectedItem);
    }

    // 아직 선택되지 않은 아이템이 있는 경우, 그 중에서 랜덤 선택
    const randomIndex = Math.floor(Math.random() * unselectedItems.length);
    const selectedItem = unselectedItems[randomIndex];

    // 선택된 아이템 업데이트
    await extendedPrisma.item.update({
      where: { id: selectedItem.id },
      data: {
        selected: true,
        lastSelectedAt: new Date(),
      },
    });

    return NextResponse.json(selectedItem);
  } catch (error) {
    console.error('Failed to select random item:', error);
    return NextResponse.json(
      { error: 'Failed to select random item' },
      { status: 500 }
    );
  }
}
