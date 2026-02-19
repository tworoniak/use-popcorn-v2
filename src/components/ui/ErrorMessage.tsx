type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className='error'>
      <p>
        <span>⛔️</span> {message}
      </p>

      {onRetry && (
        <button type='button' className='btn-retry' onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
