import { Category } from './category';
import { BaseModel } from './common';

// 기본 아이템 인터페이스 - 모든 카테고리 공통
export interface Item extends BaseModel {
  name: string;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  selected: boolean;
  lastSelectedAt: Date | null;
  metadata?: Record<string, any>; // 기타 메타데이터

  // 확장 모델 관계
  foodEntry?: any; // 순환 참조 방지를 위해 any 타입으로 선언
}

// 아이템 생성 시 필요한 데이터
export interface CreateItemDto {
  name: string;
  imageUrl?: string;
  categoryId: string;
  selected?: boolean;
  metadata?: Record<string, any>;
}
