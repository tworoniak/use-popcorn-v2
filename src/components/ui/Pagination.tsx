import { ArrowLeft, ArrowRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalResults: number;
  pageSize?: number; // OMDb is 10, but keep flexible
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
};

export default function Pagination({
  page,
  totalResults,
  pageSize = 10,
  onPrev,
  onNext,
  disabled = false,
}: PaginationProps) {
  if (totalResults <= pageSize) return null;

  const totalPages = Math.ceil(totalResults / pageSize);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  // console.log({ page, totalResults, totalPages, isFirst, isLast });

  return (
    <div className='pagination'>
      <button
        className='btn-page'
        onClick={onPrev}
        disabled={isFirst || disabled}
      >
        <ArrowLeft size={16} />
        Prev
      </button>

      <span className='page-info'>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className='btn-page'
        onClick={onNext}
        disabled={isLast || disabled}
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
}
