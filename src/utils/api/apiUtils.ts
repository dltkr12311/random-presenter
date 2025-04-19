import { ApiResponse } from '@/types/common';

/**
 * API 요청에 대한 응답을 처리하는 유틸리티 함수
 */
export async function handleApiResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || '요청 처리 중 오류가 발생했습니다.',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: '응답 처리 중 오류가 발생했습니다.',
      status: response.status,
    };
  }
}

/**
 * URL 파라미터를 인코딩하는 유틸리티 함수
 */
export function encodeQueryParams(
  params: Record<string, string | number | boolean | undefined>
): string {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
}
