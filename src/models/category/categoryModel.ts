import { Category, CategoryType } from '@/types';

// 카테고리 목록 가져오기
export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories');

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// 카테고리 생성
export const createCategory = async (
  name: string,
  icon: string,
  type?: CategoryType
): Promise<Category | null> => {
  try {
    // 타임스탬프를 추가하여 고유한 slug 생성
    const timestamp = Date.now();
    const baseSlug = name.toLowerCase().replace(/\s+/g, '-');
    const slug = `${baseSlug}-${timestamp}`;

    // type 필드를 제외하고 데이터 전송
    const requestData = {
      name,
      slug,
      icon,
      // 지금은 type 필드를 제거해서 에러를 방지
    };

    console.log('Creating category with data:', requestData);

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// 템플릿으로 카테고리 생성
export const createCategoryFromTemplate = async (
  name: string,
  icon: string,
  itemNames: string[]
): Promise<Category | null> => {
  try {
    // 타임스탬프를 추가하여 고유한 slug 생성
    const timestamp = Date.now();
    const baseSlug = name.toLowerCase().replace(/\s+/g, '-');
    const slug = `${baseSlug}-${timestamp}`;

    console.log('Creating category from template:', { name, slug, icon });

    // 카테고리 정보 준비 (type 필드 제거)
    const requestBody = {
      name,
      slug,
      icon,
      // type 필드 제거
    };

    console.log('Final request body:', JSON.stringify(requestBody));

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      console.error('Status code:', response.status);
      console.error('Status text:', response.statusText);
      throw new Error(
        `Failed to create category from template: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    try {
      const category = await response.json();
      console.log('API success response:', category);

      // 아이템 추가
      const encodedSlug = encodeURIComponent(category.slug);

      for (const name of itemNames) {
        console.log('Adding item to category:', name);
        const itemResponse = await fetch(
          `/api/categories/${encodedSlug}/items`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              imageUrl: '/default-avatar.png',
            }),
          }
        );

        if (!itemResponse.ok) {
          console.error(
            `Failed to add item ${name}:`,
            await itemResponse.text()
          );
        }
      }

      return category;
    } catch (error) {
      console.error('Error processing API response:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating category from template:', error);
    return null;
  }
};

// 카테고리 삭제
export const deleteCategory = async (slug: string): Promise<boolean> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await fetch(`/api/categories/${encodedSlug}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// 템플릿 정의 - 타입 필드 제거
export const templates = [
  {
    name: '발표자 선정',
    icon: '👨‍💼',
    items: ['김철수', '이영희', '박지민', '최서연', '정민준'],
  },
  {
    name: '오늘의 메뉴',
    icon: '🍽️',
    items: ['한식', '중식', '일식', '양식', '분식', '패스트푸드'],
  },
  {
    name: '팀 나누기',
    icon: '👥',
    items: ['A팀', 'B팀', 'C팀', 'D팀'],
  },
  {
    name: '주말 활동',
    icon: '🎮',
    items: ['영화 보기', '등산', '쇼핑', '카페', '독서', '게임'],
  },
];
