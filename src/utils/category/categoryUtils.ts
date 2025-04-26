import { CategoryFeature, CategoryType, FeatureType } from '@/types';

// 디버깅을 위한 값 확인
console.log('CategoryType values:', Object.values(CategoryType));
console.log('FeatureType values:', Object.values(FeatureType));

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
  try {
    // Prisma에 저장하기 전에 직렬화 처리
    return JSON.stringify(features);
  } catch (error) {
    console.error('Error converting features to JSON:', error);
    return JSON.stringify([]);
  }
}

/**
 * JSON에서 CategoryFeatures 배열로 변환
 */
export function jsonToFeaturesArray(json: any): CategoryFeature[] {
  if (!json) {
    console.log('Empty JSON input for features');
    return [];
  }

  console.log('JSON to convert to features array:', typeof json, json);

  try {
    // Prisma의 JSON 필드를 파싱
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    console.log('Parsed features:', parsed);

    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.log('Parsed result is not an array, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error parsing features JSON:', error);
    return [];
  }
}
