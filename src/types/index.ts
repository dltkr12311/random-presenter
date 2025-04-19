export enum FeatureType {
  RANDOM_SELECT = 'RANDOM_SELECT', // 기본 랜덤 선택 기능
  FOOD_FILTER_PRICE = 'FOOD_FILTER_PRICE', // 음식 가격대별 필터링
  FOOD_FILTER_TYPE = 'FOOD_FILTER_TYPE', // 음식 종류별 필터링 (한식, 중식 등)
  FOOD_HISTORY = 'FOOD_HISTORY', // 음식 선택 히스토리
  FOOD_MAP_VIEW = 'FOOD_MAP_VIEW', // 근처 음식점 지도 보기
}

// 카테고리 타입 enum
export enum CategoryType {
  FOOD = 'food',
  PERSON = 'person',
  ACTIVITY = 'activity',
  GENERAL = 'general',
}

export interface CategoryFeature {
  type: FeatureType;
  enabled: boolean;
  config?: Record<string, any>; // 기능별 추가 설정
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  type: CategoryType; // 카테고리 타입
  features?: CategoryFeature[]; // 카테고리별 기능 목록
  items?: Item[];
  foodEntries?: FoodEntry[]; // 음식 카테고리 확장
  createdAt: Date;
  updatedAt: Date;
}

// 기본 아이템 인터페이스 - 모든 카테고리 공통
export interface Item {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  selected: boolean;
  lastSelectedAt: Date | null;
  metadata?: Record<string, any>; // 기타 메타데이터

  // 확장 모델 관계
  foodEntry?: FoodEntry;

  createdAt: Date;
  updatedAt: Date;
}

// 음식 카테고리용 확장 인터페이스
export interface FoodEntry {
  id: string;
  itemId: string;
  item: Item;
  categoryId: string;
  category: Category;

  // 음식 특화 필드
  foodType?: string; // 음식 종류 (한식, 중식, 일식 등)
  priceRange?: string; // 가격대 (저렴, 보통, 비싼)
  location?: string; // 위치 정보
  address?: string; // 주소
  rating?: number; // 평점
  tags?: string[]; // 태그 (매운, 건강한 등)

  createdAt: Date;
  updatedAt: Date;
}

// 이전 타입과의 호환성을 위해 User 타입 유지
export type User = Item;

// 모든 타입을 한 곳에서 내보내기
export * from './category';
export * from './common';
export * from './item';

// 특화 타입
export * from './specialized/food';
