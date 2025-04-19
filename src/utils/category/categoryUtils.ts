import { CategoryFeature, CategoryType, FeatureType } from '@/types';

/**
 * 카테고리 타입에 따라 기본 기능 설정을 반환
 */
export function getDefaultFeatures(
  categoryType: CategoryType
): CategoryFeature[] {
  // 모든 카테고리는 기본 랜덤 선택 기능이 활성화
  const defaultFeatures: CategoryFeature[] = [
    {
      type: FeatureType.RANDOM_SELECT,
      enabled: true,
    },
  ];

  // 카테고리 타입에 따른 추가 기능
  switch (categoryType) {
    case CategoryType.FOOD:
      return [
        ...defaultFeatures,
        {
          type: FeatureType.FOOD_FILTER_PRICE,
          enabled: true,
        },
        {
          type: FeatureType.FOOD_FILTER_TYPE,
          enabled: true,
        },
        {
          type: FeatureType.FOOD_HISTORY,
          enabled: true,
        },
        {
          type: FeatureType.FOOD_MAP_VIEW,
          enabled: false, // 지도 API가 필요하므로 기본적으로 비활성화
          config: {
            mapProvider: 'google',
          },
        },
      ];
    default:
      return defaultFeatures;
  }
}

/**
 * CategoryFeatures 배열을 JSON으로 변환
 */
export function featuresArrayToJson(features: CategoryFeature[]): any {
  return features;
}

/**
 * JSON에서 CategoryFeatures 배열로 변환
 */
export function jsonToFeaturesArray(json: any): CategoryFeature[] {
  if (!json) return [];

  // Prisma의 JSON 필드를 파싱
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;

  return Array.isArray(parsed) ? parsed : [];
}
