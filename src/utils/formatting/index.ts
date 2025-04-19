/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return '날짜 없음';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 슬러그 생성 함수
 */
export function generateSlug(text: string): string {
  // 타임스탬프를 추가하여 고유한 슬러그 생성
  const timestamp = Date.now();
  const baseSlug = text
    .toLowerCase()
    .trim()
    // 특수문자를 하이픈이나 빈 문자열로 대체
    .replace(/[^\w\s-]/g, '') // 알파벳, 숫자, 하이픈, 공백 외 모든 문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
    .replace(/-+/g, '-'); // 연속된 하이픈을 하나로 변환

  return `${baseSlug}-${timestamp}`;
}
