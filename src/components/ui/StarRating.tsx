import { useState, type KeyboardEvent } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number | string;

  // controlled support
  rating?: number;
  onSetRating?: (rating: number) => void;

  // a11y
  label?: string;
  allowClear?: boolean; // press 0 to clear
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const starContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const starStyle = {
  width: '24px',
  height: '24px',
  display: 'block',
  cursor: 'pointer',
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function StarItem({
  onRate,
  full,
  color,
  size,
  onHoverIn,
  onHoverOut,
}: {
  onRate: () => void;
  full: boolean;
  color: string;
  size: number | string;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) {
  return (
    <span
      role='button'
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      aria-hidden='true'
    >
      {full ? (
        <Star fill={color} strokeWidth={1.5} color={color} size={size} />
      ) : (
        <Star strokeWidth={1.5} color={color} size={size} />
      )}
    </span>
  );
}

export default function StarRating({
  maxRating = 10,
  color = '#fcc419',
  size = 24,
  rating,
  onSetRating,
  label = 'Rating',
  allowClear = true,
}: StarRatingProps) {
  const isControlled = typeof rating === 'number';

  // only used in uncontrolled mode
  const [uncontrolledRating, setUncontrolledRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const currentRating = isControlled ? (rating ?? 0) : uncontrolledRating;

  function setRatingValue(value: number) {
    const next = clamp(value, 0, maxRating);
    if (!isControlled) setUncontrolledRating(next);
    onSetRating?.(next);
  }

  function handleRate(value: number) {
    setRatingValue(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const key = e.key;

    // prevent page scroll on arrow keys
    if (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End'
    ) {
      e.preventDefault();
    }

    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        setRatingValue(currentRating + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        setRatingValue(currentRating - 1);
        break;
      case 'Home':
        setRatingValue(1);
        break;
      case 'End':
        setRatingValue(maxRating);
        break;
      case '0':
        if (allowClear) setRatingValue(0);
        break;
      default:
        break;
    }
  }

  const textStyle = { lineHeight: '1', margin: 0 as const };

  return (
    <div style={containerStyle}>
      {/* Focusable/keyboard-operable wrapper */}
      <div
        style={starContainerStyle}
        role='slider'
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={maxRating}
        aria-valuenow={currentRating}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setTempRating(0)}
      >
        {Array.from({ length: maxRating }, (_, i) => (
          <StarItem
            key={i}
            color={color}
            size={size}
            onRate={() => handleRate(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= i + 1 : currentRating >= i + 1}
          />
        ))}
      </div>

      <p style={{ ...textStyle, color }}>{tempRating || currentRating || ''}</p>
    </div>
  );
}
