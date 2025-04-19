import { Category } from '../category';

/**
 * 음식 타입 정의
 */
export type FoodType =
  | 'korean'
  | 'japanese'
  | 'chinese'
  | 'western'
  | 'fusion'
  | 'dessert'
  | 'etc';

/**
 * 음식 가격대 정의
 */
export type PriceRange = 'cheap' | 'moderate' | 'expensive' | 'premium';

/**
 * 음식 항목의 기본 구조
 */
export interface FoodEntry {
  id: string;
  name: string;
  description: string;
  price: number;
  priceRange: string;
  foodType: string;
  imageUrl?: string;
  ingredients?: string[];
  calories?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  categoryId: string;
  category?: Category;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 음식 항목 생성을 위한 DTO
 */
export interface CreateFoodEntryDto {
  name: string;
  description: string;
  price: number;
  priceRange: string;
  foodType: string;
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
  priceRange?: string;
  foodType?: string;
  imageUrl?: string;
  ingredients?: string[];
  calories?: number;
  allergens?: string[];
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  categoryId?: string;
}

/**
 * 음식 항목 검색 필터
 */
export interface FoodSearchFilter {
  categoryId?: string;
  priceRange?: string;
  foodType?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  searchTerm?: string;
}

// 음식 타입 옵션 상수
export const FOOD_TYPES = [
  { value: 'korean', label: '한식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'western', label: '양식' },
  { value: 'fusion', label: '퓨전' },
  { value: 'dessert', label: '디저트' },
  { value: 'etc', label: '기타' },
];

// 가격 범위 옵션 상수
export const PRICE_RANGES = [
  { value: 'cheap', label: '저렴 (만원 미만)' },
  { value: 'moderate', label: '보통 (1-3만원)' },
  { value: 'expensive', label: '비싼 (3-5만원)' },
  { value: 'premium', label: '프리미엄 (5만원 이상)' },
];
