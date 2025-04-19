import { BaseModel } from './common';
import { Item } from './item';
// 순환 참조를 피하기 위해 타입만 import
import type { FoodEntry } from './specialized/food';

// 카테고리 타입 enum
export enum CategoryType {
  FOOD = 'food',
  PERSON = 'person',
  ACTIVITY = 'activity',
  GENERAL = 'general',
}

// 카테고리 기능 유형
export enum FeatureType {
  RANDOM_SELECT = 'RANDOM_SELECT', // 기본 랜덤 선택 기능
  FOOD_FILTER_PRICE = 'FOOD_FILTER_PRICE', // 음식 가격대별 필터링
  FOOD_FILTER_TYPE = 'FOOD_FILTER_TYPE', // 음식 종류별 필터링 (한식, 중식 등)
  FOOD_HISTORY = 'FOOD_HISTORY', // 음식 선택 히스토리
  FOOD_MAP_VIEW = 'FOOD_MAP_VIEW', // 근처 음식점 지도 보기
}

// 카테고리 기능 설정
export interface CategoryFeature {
  type: FeatureType;
  enabled: boolean;
  config?: Record<string, any>; // 기능별 추가 설정
}

// 카테고리 모델
export interface Category extends BaseModel {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  type: CategoryType; // 카테고리 타입
  features?: CategoryFeature[]; // 카테고리별 기능 목록
  items?: Item[];
  foodEntries?: FoodEntry[]; // 음식 카테고리 확장
}

// 새 카테고리 생성 시 필요한 데이터
export interface CreateCategoryDto {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  type: CategoryType;
}
