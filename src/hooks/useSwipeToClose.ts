import { useEffect } from 'react';

type Options = {
  enabled?: boolean;
  thresholdPx?: number; // how far to swipe to trigger
  allowedTimeMs?: number; // optional: ignore very slow drags
};

export function useSwipeToClose(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  { enabled = true, thresholdPx = 80, allowedTimeMs = 800 }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
      tracking = true;
    }

    function onTouchMove(e: TouchEvent) {
      if (!tracking || e.touches.length !== 1) return;

      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // Only consider mostly-horizontal right swipes
      if (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx)) {
        tracking = false; // user is scrolling vertically
        return;
      }

      // Optional: prevent accidental swipe during slight moves
      // We do NOT preventDefault to avoid breaking scroll.
    }

    function onTouchEnd(e: TouchEvent) {
      if (!tracking) return;
      tracking = false;

      const endT = Date.now();
      const dt = endT - startT;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      const mostlyHorizontal = Math.abs(dx) > Math.abs(dy);
      const fastEnough = dt <= allowedTimeMs;

      if (mostlyHorizontal && fastEnough && dx >= thresholdPx) {
        onClose();
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [ref, onClose, enabled, thresholdPx, allowedTimeMs]);
}
