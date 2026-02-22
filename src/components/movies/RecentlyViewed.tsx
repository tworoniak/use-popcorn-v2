import type { RecentMovie } from '../../types/recent';
import Poster from '../ui/Poster';

type RecentlyViewedProps = {
  items: RecentMovie[];
  onOpen: (imdbID: string) => void;
  onClear?: () => void;
};

export default function RecentlyViewed({
  items,
  onOpen,
  onClear,
}: RecentlyViewedProps) {
  if (items.length === 0) return null;

  return (
    <section className='recent'>
      <div className='recent__header'>
        <h3 className='recent__title'>Recently viewed</h3>

        {onClear && (
          <button type='button' className='recent__clear' onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <ul className='recent__list' aria-label='Recently viewed movies'>
        {items.map((m) => (
          <li key={m.imdbID} className='recent__item'>
            <button
              type='button'
              className='recent__btn'
              onClick={() => onOpen(m.imdbID)}
              title={`${m.Title} (${m.Year})`}
            >
              <Poster
                src={m.Poster}
                alt={`${m.Title} poster`}
                className='recent__poster'
              />
              <span className='recent__meta'>
                <span className='recent__name'>{m.Title}</span>
                <span className='recent__year'>{m.Year}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
