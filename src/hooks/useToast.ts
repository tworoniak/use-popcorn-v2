import { useCallback, useRef, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info';

type ToastState = {
  message: string;
  kind: ToastKind;
  actionLabel?: string;
  onAction?: () => void;
};

export function useToast(timeoutMs = 3000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const show = useCallback(
    (next: ToastState) => {
      setIsClosing(false);
      setToast(next);

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setIsClosing(true);
        window.setTimeout(() => {
          setToast(null);
          setIsClosing(false);
        }, 140);
      }, timeoutMs);
    },
    [timeoutMs],
  );

  const close = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setIsClosing(true);

    window.setTimeout(() => {
      setToast(null);
      setIsClosing(false);
    }, 140);
  }, []);

  return { toast, show, close, isClosing };
}
