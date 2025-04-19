// 여러 파일에서 사용되는 공통 타입 정의

// 기존 User 타입은 호환성을 위해 유지하고 Item으로 대체되었음을 명시
import { Item } from './item';
export type User = Item;

// 기본 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// 타임스탬프가 있는 모델의 기본 인터페이스
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 페이징 관련 타입
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
