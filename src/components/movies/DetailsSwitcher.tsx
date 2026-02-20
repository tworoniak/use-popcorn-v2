import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSwipeToCloseDrag } from '../../hooks/useSwipeToCloseDrag';

type DetailsSwitcherProps = {
  selectedId: string | null; // current open/close signal
  activeId: string | null; // last selected id (kept by App)
  watchedView: ReactNode;
  detailsView: (id: string) => ReactNode;
  onRequestClose: () => void;
  durationMs?: number;
};

export default function DetailsSwitcher({
  selectedId,
  activeId,
  watchedView,
  detailsView,
  onRequestClose,
  durationMs = 180,
}: DetailsSwitcherProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    // opening: clear closing on next frame (avoids sync setState in effect)
    if (selectedId) {
      const raf = window.requestAnimationFrame(() => setIsClosing(false));
      return () => window.cancelAnimationFrame(raf);
    }

    // closing: start closing on next frame, then clear after duration
    if (!selectedId && activeId) {
      const raf = window.requestAnimationFrame(() => setIsClosing(true));

      closeTimerRef.current = window.setTimeout(() => {
        setIsClosing(false);
        closeTimerRef.current = null;
      }, durationMs);

      return () => {
        window.cancelAnimationFrame(raf);
        if (closeTimerRef.current) {
          window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
      };
    }
  }, [selectedId, activeId, durationMs]);

  const showDetails = !!selectedId || (!!activeId && isClosing);
  const idToRender = selectedId ?? activeId;

  const detailsPaneRef = useRef<HTMLDivElement | null>(null);

  useSwipeToCloseDrag(detailsPaneRef, onRequestClose, {
    enabledMediaQuery: '(max-width: 600px)',
  });

  return (
    <div className='panel'>
      <div
        className={`panel__pane panel__pane--watched ${showDetails ? 'is-hidden' : ''}`}
        aria-hidden={showDetails}
      >
        {watchedView}
      </div>

      <div
        ref={detailsPaneRef}
        className={`panel__pane panel__pane--details ${
          selectedId ? 'is-active' : isClosing ? 'is-closing' : ''
        }`}
        aria-hidden={!showDetails}
      >
        {idToRender ? detailsView(idToRender) : null}
      </div>
    </div>
  );
}
