type NumResultsProps = {
  totalResults: number;
  page: number;
  pageSize?: number;
  currentCount: number;
};

export default function NumResults({
  totalResults,
  page,
  pageSize = 10,
  currentCount,
}: NumResultsProps) {
  if (totalResults === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = (page - 1) * pageSize + currentCount;

  return (
    <p className='num-results'>
      Showing{' '}
      <strong>
        {start}–{end}
      </strong>{' '}
      of <strong>{totalResults}</strong>
    </p>
  );
}
