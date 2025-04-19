import { Item } from '@/types';

// 특정 카테고리의 아이템 목록 가져오기
export const fetchCategoryItems = async (
  categorySlug: string
): Promise<Item[]> => {
  if (!categorySlug) return [];

  try {
    const encodedSlug = encodeURIComponent(categorySlug);
    const response = await fetch(`/api/categories/${encodedSlug}/items`);

    if (!response.ok) {
      throw new Error(
        `서버 응답 오류: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch items for category ${categorySlug}:`, error);
    return [];
  }
};

// 아이템 추가하기
export const addItem = async (
  categorySlug: string,
  name: string,
  imageUrl: string = '/default-avatar.png',
  foodDetails?: {
    foodType?: string;
    priceRange?: string;
    location?: string;
    address?: string;
    rating?: number;
    tags?: string[];
  }
): Promise<Item | null> => {
  try {
    const encodedSlug = encodeURIComponent(categorySlug);
    const response = await fetch(`/api/categories/${encodedSlug}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        imageUrl,
        ...foodDetails, // 음식 세부 정보가 있는 경우 추가
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add item');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add item:', error);
    return null;
  }
};

// 여러 아이템 한번에 추가하기
export const addBulkItems = async (
  categorySlug: string,
  itemNames: string[]
): Promise<boolean> => {
  if (!categorySlug || itemNames.length === 0) return false;

  try {
    const encodedSlug = encodeURIComponent(categorySlug);

    // 각 아이템을 순차적으로 추가
    for (const name of itemNames) {
      await fetch(`/api/categories/${encodedSlug}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          imageUrl: '/default-avatar.png',
        }),
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to add bulk items:', error);
    return false;
  }
};

// 아이템 삭제하기
export const deleteItem = async (
  categorySlug: string,
  itemId: string
): Promise<boolean> => {
  try {
    const encodedSlug = encodeURIComponent(categorySlug);
    const response = await fetch(
      `/api/categories/${encodedSlug}/items/${itemId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }

    return true;
  } catch (error) {
    console.error('Failed to delete item:', error);
    return false;
  }
};

// 삭제된 아이템 복원하기
export const restoreItem = async (
  categorySlug: string,
  name: string,
  imageUrl: string,
  selected: boolean
): Promise<Item | null> => {
  try {
    const encodedSlug = encodeURIComponent(categorySlug);
    const response = await fetch(`/api/categories/${encodedSlug}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        imageUrl,
        selected,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to restore item');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to restore item:', error);
    return null;
  }
};

// 랜덤 아이템 선택하기
export const selectRandomItem = async (
  categorySlug: string
): Promise<Item | null> => {
  try {
    const encodedSlug = encodeURIComponent(categorySlug);
    const response = await fetch(`/api/categories/${encodedSlug}/random`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(
        `서버 응답 오류: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to select random item:', error);
    return null;
  }
};

// 이미지 업로드
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};
