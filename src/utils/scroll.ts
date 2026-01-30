"use client";

// 부드러운 스크롤을 위한 공통 유틸리티 함수들

/**
 * 지정된 ID를 가진 요소로 부드럽게 스크롤합니다.
 * @param elementId - 스크롤할 요소의 ID
 * @param duration - 애니메이션 지속 시간 (밀리초, 기본값: 800)
 * @param offset - 추가 오프셋 값 (양수: 아래로, 음수: 위로, 기본값: 0)
 */
export function smoothScrollToElement(
  elementId: string,
  duration: number = 800,
  offset: number = 0
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id "${elementId}" not found`);
    return;
  }

  const start = window.pageYOffset;
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  // 화면 중앙에 위치시키되, offset만큼 추가 조정
  const end = elementTop - window.innerHeight / 2 + offset;
  const distance = end - start;

  if (Math.abs(distance) < 1) {
    // 이미 목표 위치에 가까우면 스크롤하지 않음
    return;
  }

  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // easing function (ease-in-out cubic)
    const easeInOutCubic =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, start + distance * easeInOutCubic);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * 요소가 뷰포트에 보이는지 확인합니다.
 * @param elementId - 확인할 요소의 ID
 * @returns 요소가 보이면 true, 아니면 false
 */
export function isElementInViewport(elementId: string): boolean {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 스크롤 관련 상수들 (필요시 다른 파일에서 import하여 사용)
 */
export const SCROLL_CONSTANTS = {
  DEFAULT_DURATION: 800,
  DEFAULT_OFFSET: 0,
  TAB_SWITCH_DELAY: 300,
} as const;
