type PaginationProps = {
  page: number;
  totalResults: number;
  pageSize?: number; // OMDb is 10, but keep flexible
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({
  page,
  totalResults,
  pageSize = 10,
  onPrev,
  onNext,
}: PaginationProps) {
  if (totalResults <= pageSize) return null;

  const totalPages = Math.ceil(totalResults / pageSize);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className='pagination'>
      <button className='btn-page' onClick={onPrev} disabled={isFirst}>
        ← Prev
      </button>

      <span className='page-info'>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button className='btn-page' onClick={onNext} disabled={isLast}>
        Next →
      </button>
    </div>
  );
}
