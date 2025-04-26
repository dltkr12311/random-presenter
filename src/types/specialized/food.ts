import { Category } from '../category';

/**
 * 음식 타입 정의
 */
export type FoodType =
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '패스트푸드'
  | '카페/디저트'
  | '술집'
  | '기타';

/**
 * 음식 가격대 정의
 */
export type PriceRange = '저렴' | '보통' | '비싼';

/**
 * 음식 항목의 기본 구조
 */
export interface FoodEntry {
  id: string;
  name: string;
  description?: string;
  price?: number;
  priceRange: PriceRange;
  foodType: FoodType;
  imageUrl?: string;
  ingredients?: string[];
  calories?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  categoryId: string;
  itemId: string;
  category?: Category;
  location?: string;
  address?: string;
  rating?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * 음식 항목 생성을 위한 DTO
 */
export interface CreateFoodEntryDto {
  name: string;
  description?: string;
  price?: number;
  priceRange: PriceRange;
  foodType: FoodType;
  imageUrl?: string;
  ingredients?: string[];
  calories?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  categoryId: string;
  itemId?: string;
  location?: string;
  address?: string;
  rating?: number;
  tags?: string[];
}

/**
 * 음식 항목 업데이트를 위한 DTO
 */
export interface UpdateFoodEntryDto {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  priceRange?: PriceRange;
  foodType?: FoodType;
  imageUrl?: string;
  ingredients?: string[];
  calories?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  categoryId?: string;
  location?: string;
  address?: string;
  rating?: number;
  tags?: string[];
}

/**
 * 음식 항목 검색 필터
 */
export interface FoodSearchFilter {
  categoryId?: string;
  priceRange?: PriceRange;
  foodType?: FoodType;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  searchTerm?: string;
  location?: string;
}

// 음식 타입 옵션 상수
export const FOOD_TYPES = [
  { value: '한식', label: '한식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '양식', label: '양식' },
  { value: '분식', label: '분식' },
  { value: '패스트푸드', label: '패스트푸드' },
  { value: '카페/디저트', label: '카페/디저트' },
  { value: '술집', label: '술집' },
  { value: '기타', label: '기타' },
];

// 가격 범위 옵션 상수
export const PRICE_RANGES = [
  { value: '저렴', label: '저렴 (만원 미만)' },
  { value: '보통', label: '보통 (1-3만원)' },
  { value: '비싼', label: '비싼 (3만원 이상)' },
];
