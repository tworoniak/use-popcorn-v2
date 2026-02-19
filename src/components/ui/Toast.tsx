type ToastProps = {
  message: string;
  kind?: 'success' | 'error' | 'info';
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export default function Toast({
  message,
  kind = 'info',
  onClose,
  actionLabel,
  onAction,
  className,
}: ToastProps) {
  return (
    <div
      className={`toast toast--${kind} ${className ?? ''}`}
      role='status'
      aria-live='polite'
    >
      <span className='toast__msg'>{message}</span>

      <div className='toast__actions'>
        {actionLabel && onAction && (
          <button type='button' className='toast__action' onClick={onAction}>
            {actionLabel}
          </button>
        )}
        <button className='toast__btn' onClick={onClose} aria-label='Dismiss'>
          ×
        </button>
      </div>
    </div>
  );
}
