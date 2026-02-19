import { useCallback, useRef, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info';

export function useToast(timeoutMs = 2200) {
  const [toast, setToast] = useState<{
    message: string;
    kind: ToastKind;
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  const show = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      setToast({ message, kind });
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setToast(null), timeoutMs);
    },
    [timeoutMs],
  );

  const close = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, show, close };
}
