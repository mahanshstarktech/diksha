import { useEffect, useRef } from 'react';

/**
 * Keeps scrolling smooth & native (no harsh mandatory lock), while ensuring
 * a scroll/swipe starting from the initial Hero screen lands cleanly at the
 * top of #section-ask (so the Date Idea box is never cut off mid-scroll).
 */
export function useSmootScroll() {
  const startScrollYRef = useRef(0);
  const landedAskRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const captureStart = () => {
      startScrollYRef.current = window.scrollY;
      if (window.scrollY < 40) {
        landedAskRef.current = false;
      }
    };

    const alignToAskIfFromHero = () => {
      const hero = document.getElementById('section-hero');
      const ask = document.getElementById('section-ask');
      if (!hero || !ask) return;

      const askTop = ask.offsetTop;
      const y = window.scrollY;
      const startedInHero = startScrollYRef.current < hero.offsetHeight * 0.45;

      if (startedInHero && !landedAskRef.current && y > 40 && y < askTop + 320) {
        landedAskRef.current = true;
        ask.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const onScroll = () => {
      const ask = document.getElementById('section-ask');
      if (!ask) return;
      if (window.scrollY < 20) {
        landedAskRef.current = false;
        return;
      }
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(alignToAskIfFromHero, 90);
    };

    let touchEndTimer: ReturnType<typeof setTimeout> | null = null;
    const onTouchEnd = () => {
      if (touchEndTimer) clearTimeout(touchEndTimer);
      touchEndTimer = setTimeout(alignToAskIfFromHero, 40);
    };

    window.addEventListener('touchstart', captureStart, { passive: true });
    window.addEventListener('wheel', captureStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (touchEndTimer) clearTimeout(touchEndTimer);
      window.removeEventListener('touchstart', captureStart);
      window.removeEventListener('wheel', captureStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return useRef<null>(null);
}

/**
 * Smoothly scrolls to a section element by ID.
 */
export function scrollToSection(id: string, _unused?: unknown) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
