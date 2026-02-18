type MovieListSkeletonProps = {
  count?: number;
};

export default function MovieListSkeleton({
  count = 10,
}: MovieListSkeletonProps) {
  return (
    <ul className='list list-movies'>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className='skeleton-row'>
          <div className='skeleton-poster' />
          <div className='skeleton-text'>
            <div className='skeleton-line skeleton-line--title' />
            <div className='skeleton-line skeleton-line--meta' />
          </div>
        </li>
      ))}
    </ul>
  );
}
