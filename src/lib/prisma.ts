import { PrismaClient } from '@prisma/client';

// 기존 모델과 새 모델을 포함한 확장 타입 정의
export type ExtendedPrismaClient = PrismaClient & {
  category: any;
  item: any;
  cycle: any;
  foodEntry: any;
  user: any; // 기존 모델도 포함
};

// 전역 타입 선언
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient 인스턴스 생성
const prisma = global.prisma || new PrismaClient();

// 개발 환경에서 인스턴스 재사용을 위한 전역 할당
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// 타입이 확장된 prisma 클라이언트 내보내기
export const extendedPrisma = prisma as unknown as ExtendedPrismaClient;
export { prisma };
