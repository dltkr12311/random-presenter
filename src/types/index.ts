export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  items?: Item[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  selected: boolean;
  lastSelectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// 이전 타입과의 호환성을 위해 User 타입 유지
export type User = Item;
