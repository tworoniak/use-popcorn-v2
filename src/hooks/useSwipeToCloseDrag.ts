import { useEffect, type RefObject } from 'react';

type Options = {
  enabled?: boolean;
  enabledMediaQuery?: string; // e.g. '(max-width: 600px)'
  thresholdPx?: number;
  velocityPxPerMs?: number;
  slopPx?: number;
  durationMs?: number;
};

export function useSwipeToCloseDrag(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  {
    enabled = true,
    enabledMediaQuery,
    thresholdPx = 110,
    velocityPxPerMs = 0.6,
    slopPx = 10,
    durationMs = 180,
  }: Options = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mediaOk = enabledMediaQuery
      ? window.matchMedia(enabledMediaQuery).matches
      : true;

    const isEnabled = enabled && mediaOk;
    if (!isEnabled) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;

    let dragging = false;
    let locked = false;
    let lastDx = 0;

    const originalTransition = root.style.transition;
    const originalTransform = root.style.transform;
    const originalWillChange = root.style.willChange;

    function setTranslate(dx: number) {
      const el = ref.current;
      if (!el) return;

      const clamped = Math.max(0, dx);
      lastDx = clamped;
      el.style.transform = `translateX(${clamped}px)`;
    }

    function snapTo(dx: number, after?: () => void) {
      const el = ref.current;
      if (!el) return;

      el.style.transition = `transform ${durationMs}ms ease`;
      setTranslate(dx);

      window.setTimeout(() => {
        const el2 = ref.current;
        if (!el2) return;

        el2.style.transition = originalTransition;
        after?.();
      }, durationMs);
    }

    function onTouchStart(e: TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();

      dragging = false;
      locked = false;
      lastDx = 0;

      el.style.willChange = 'transform';
    }

    function onTouchMove(e: TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!locked) {
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);

        if (ax < slopPx && ay < slopPx) return;

        locked = true;

        // mostly vertical => allow scrolling
        if (ay > ax) return;

        dragging = true;
        el.style.transition = 'none';
      }

      if (!dragging) return;

      e.preventDefault();
      setTranslate(dx);
    }

    function onTouchEnd() {
      const el = ref.current;
      if (!el) return;

      el.style.willChange = originalWillChange || '';

      if (!dragging) {
        el.style.transition = originalTransition;
        el.style.transform = originalTransform;
        return;
      }

      dragging = false;

      const dt = Math.max(1, Date.now() - startT);
      const velocity = lastDx / dt;

      const shouldClose =
        lastDx >= thresholdPx || (velocity >= velocityPxPerMs && lastDx >= 60);

      if (shouldClose) {
        const width = window.innerWidth || 400;

        snapTo(width, () => {
          const el2 = ref.current;
          if (!el2) return;

          el2.style.transform = originalTransform;
          el2.style.transition = originalTransition;
          onClose();
        });
      } else {
        snapTo(0, () => {
          const el2 = ref.current;
          if (!el2) return;

          el2.style.transform = originalTransform;
          el2.style.transition = originalTransition;
        });
      }
    }

    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('touchend', onTouchEnd, { passive: true });
    root.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('touchend', onTouchEnd);
      root.removeEventListener('touchcancel', onTouchEnd);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const el3 = ref.current;
      if (el3) {
        el3.style.willChange = originalWillChange || '';
        el3.style.transition = originalTransition;
        el3.style.transform = originalTransform;
      }
    };
  }, [
    ref,
    onClose,
    enabled,
    enabledMediaQuery,
    thresholdPx,
    velocityPxPerMs,
    slopPx,
    durationMs,
  ]);
}
