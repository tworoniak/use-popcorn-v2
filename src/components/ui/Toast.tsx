type ToastProps = {
  message: string;
  kind?: 'success' | 'error' | 'info';
  onClose: () => void;
};

export default function Toast({ message, kind = 'info', onClose }: ToastProps) {
  return (
    <div className={`toast toast--${kind}`} role='status' aria-live='polite'>
      <span className='toast__msg'>{message}</span>
      <button className='toast__btn' onClick={onClose} aria-label='Dismiss'>
        ×
      </button>
    </div>
  );
}
