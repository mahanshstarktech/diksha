import { useRef } from 'react';

/**
 * Returns a ref placeholder for backwards-compatible signature and provides
 * native smooth section scrolling that cooperates with CSS scroll-snap.
 */
export function useSmootScroll() {
  return useRef<null>(null);
}

/**
 * Smoothly scrolls to a section element by ID, aligning cleanly to its snap start.
 */
export function scrollToSection(id: string, _unused?: unknown) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
