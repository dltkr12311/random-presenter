import { FoodEntry } from '@/types/specialized/food';
import { encodeQueryParams, handleApiResponse } from '@/utils/api/apiUtils';

/**
 * 음식 항목 정보 조회
 */
export async function fetchFoodEntry(
  itemId: string
): Promise<FoodEntry | null> {
  try {
    console.log('Fetching food entry for item:', itemId);
    const response = await fetch(`/api/food-entries/${itemId}`);
    const apiResponse = await handleApiResponse<FoodEntry>(response);

    if (apiResponse.error || !apiResponse.data) {
      console.error('Failed to fetch food entry:', apiResponse.error);
      return null;
    }

    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching food entry:', error);
    return null;
  }
}

/**
 * 가격별 음식 항목 필터링
 */
export async function fetchFoodItemsByPrice(
  categorySlug: string,
  priceRange: string
): Promise<FoodEntry[]> {
  try {
    const params = encodeQueryParams({ priceRange });
    const response = await fetch(
      `/api/categories/${categorySlug}/food${params}`
    );
    const apiResponse = await handleApiResponse<FoodEntry[]>(response);

    if (apiResponse.error || !apiResponse.data) {
      console.error('Failed to fetch food items by price:', apiResponse.error);
      return [];
    }

    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching food items by price:', error);
    return [];
  }
}

/**
 * 음식 종류별 필터링
 */
export async function fetchFoodItemsByType(
  categorySlug: string,
  foodType: string
): Promise<FoodEntry[]> {
  try {
    const params = encodeQueryParams({ foodType });
    const response = await fetch(
      `/api/categories/${categorySlug}/food${params}`
    );
    const apiResponse = await handleApiResponse<FoodEntry[]>(response);

    if (apiResponse.error || !apiResponse.data) {
      console.error('Failed to fetch food items by type:', apiResponse.error);
      return [];
    }

    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching food items by type:', error);
    return [];
  }
}
