import { extendedPrisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST /api/random - 랜덤 발표자 선정
export async function POST() {
  try {
    // 현재 활성화된 사이클 확인
    let cycle = await extendedPrisma.cycle.findFirst({
      where: { isActive: true },
    });

    // 활성화된 사이클이 없으면 새로 생성
    if (!cycle) {
      cycle = await extendedPrisma.cycle.create({
        data: { startDate: new Date() },
      });
    }

    // 아직 선택되지 않은 사용자 중에서 랜덤 선택
    const unselectedUsers = await extendedPrisma.user.findMany({
      where: { selected: false },
    });

    // 모든 사용자가 선택되었다면 새로운 사이클 시작
    if (unselectedUsers.length === 0) {
      // 이전 사이클 종료
      await extendedPrisma.cycle.update({
        where: { id: cycle.id },
        data: { isActive: false, endDate: new Date() },
      });

      // 새 사이클 시작
      cycle = await extendedPrisma.cycle.create({
        data: { startDate: new Date() },
      });

      // 모든 사용자 리셋
      await extendedPrisma.user.updateMany({
        data: { selected: false, lastSelectedAt: null },
      });

      // 다시 선택되지 않은 사용자 조회
      const resetUsers = await extendedPrisma.user.findMany();
      unselectedUsers.push(...resetUsers);
    }

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * unselectedUsers.length);
    const selectedUser = unselectedUsers[randomIndex];

    // 선택된 사용자 업데이트
    await extendedPrisma.user.update({
      where: { id: selectedUser.id },
      data: {
        selected: true,
        lastSelectedAt: new Date(),
      },
    });

    return NextResponse.json(selectedUser);
  } catch (error) {
    console.error('Failed to select random user:', error);
    return NextResponse.json(
      { error: 'Failed to select random user' },
      { status: 500 }
    );
  }
}
