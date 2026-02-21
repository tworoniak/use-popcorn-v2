// src/hooks/useSwipeToCloseDrag.ts
import { useEffect } from 'react';

type Options = {
  enabled?: boolean;
  thresholdPx?: number; // distance to trigger close
  velocityPxPerMs?: number; // quick flick closes
  slopPx?: number; // ignore tiny jitter
  durationMs?: number; // snap animation duration
};

export function useSwipeToCloseDrag(
  el: HTMLElement | null,
  onClose: () => void,
  {
    enabled = true,
    thresholdPx = 110,
    velocityPxPerMs = 0.6,
    slopPx = 10,
    durationMs = 180,
  }: Options = {},
) {
  useEffect(() => {
    if (!el || !enabled) return;

    const root = el;

    let startX = 0;
    let startY = 0;
    let startT = 0;

    let mode: 'undecided' | 'horizontal' | 'vertical' = 'undecided';
    let lastDx = 0;

    const originalTransition = root.style.transition;
    const originalTransform = root.style.transform;
    const originalWillChange = root.style.willChange;

    function setTranslate(dx: number) {
      const clamped = Math.max(0, dx);
      lastDx = clamped;
      root.style.transform = `translateX(${clamped}px)`;
    }

    function snapTo(dx: number, after?: () => void) {
      root.style.transition = `transform ${durationMs}ms ease`;
      setTranslate(dx);

      window.setTimeout(() => {
        // element might still exist; restore inline transition so CSS can take over
        root.style.transition = originalTransition;
        after?.();
      }, durationMs);
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();

      mode = 'undecided';
      lastDx = 0;

      root.style.willChange = 'transform';
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      const ax = Math.abs(dx);
      const ay = Math.abs(dy);

      if (mode === 'undecided') {
        if (ax < slopPx && ay < slopPx) return;

        // require horizontal dominance (avoids fighting vertical scroll)
        const horizontalWins = ax > ay * 1.2;
        mode = horizontalWins ? 'horizontal' : 'vertical';

        if (mode === 'horizontal') {
          root.style.transition = 'none';
        } else {
          // allow normal vertical scrolling
          root.style.willChange = originalWillChange || '';
          return;
        }
      }

      if (mode !== 'horizontal') return;

      // prevent page scroll while dragging horizontally
      e.preventDefault();
      setTranslate(dx);
    }

    function finishGesture() {
      root.style.willChange = originalWillChange || '';

      if (mode !== 'horizontal') {
        root.style.transition = originalTransition;
        root.style.transform = originalTransform;
        mode = 'undecided';
        lastDx = 0;
        return;
      }

      const dt = Math.max(1, Date.now() - startT);
      const velocity = lastDx / dt; // px/ms

      const shouldClose =
        lastDx >= thresholdPx || (velocity >= velocityPxPerMs && lastDx >= 60);

      if (shouldClose) {
        const width = window.innerWidth || 400;

        root.style.opacity = '1';

        snapTo(width, () => {
          root.style.opacity = '0'; // ✅ fully hide
          onClose();
        });
      } else {
        snapTo(0, () => {
          root.style.transform = originalTransform;
          root.style.transition = originalTransition;
        });
      }

      mode = 'undecided';
      lastDx = 0;
    }

    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('touchend', finishGesture, { passive: true });
    root.addEventListener('touchcancel', finishGesture, { passive: true });

    return () => {
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('touchend', finishGesture);
      root.removeEventListener('touchcancel', finishGesture);

      root.style.opacity = '';
      root.style.willChange = originalWillChange || '';
      root.style.transition = originalTransition;
      root.style.transform = originalTransform;
    };
  }, [el, onClose, enabled, thresholdPx, velocityPxPerMs, slopPx, durationMs]);
}
