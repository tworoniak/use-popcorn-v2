import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useSwipeToCloseDrag } from '../../hooks/useSwipeToCloseDrag';

type DetailsSwitcherProps = {
  selectedId: string | null;
  activeId: string | null;
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

  // ✅ track the actual DOM node
  const [detailsEl, setDetailsEl] = useState<HTMLDivElement | null>(null);

  const setDetailsRef = useCallback((node: HTMLDivElement | null) => {
    setDetailsEl(node);
  }, []);

  useEffect(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (selectedId) {
      const raf = window.requestAnimationFrame(() => setIsClosing(false));
      return () => window.cancelAnimationFrame(raf);
    }

    if (!selectedId && activeId) {
      const raf = window.requestAnimationFrame(() => setIsClosing(true));

      closeTimerRef.current = window.setTimeout(() => {
        setIsClosing(false);
        closeTimerRef.current = null;
      }, durationMs);

      return () => {
        window.cancelAnimationFrame(raf);
        if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      };
    }
  }, [selectedId, activeId, durationMs]);

  const showDetails = !!selectedId || (!!activeId && isClosing);
  const idToRender = selectedId ?? activeId;

  useSwipeToCloseDrag(detailsEl, onRequestClose, {
    enabled: showDetails,
    thresholdPx: 90,
    slopPx: 6,
    durationMs,
  });

  return (
    <div className='panel'>
      <div
        className={`panel__pane panel__pane--watched ${showDetails ? 'is-hidden' : ''}`}
      >
        {watchedView}
      </div>

      <div
        ref={setDetailsRef}
        className={`panel__pane panel__pane--details ${
          selectedId ? 'is-active' : isClosing ? 'is-closing' : ''
        }`}
      >
        {idToRender ? detailsView(idToRender) : null}
      </div>
    </div>
  );
}
