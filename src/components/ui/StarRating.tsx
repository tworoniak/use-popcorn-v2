import { useState } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number | string;

  // controlled support
  rating?: number;
  onSetRating?: (rating: number) => void;
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
}: StarRatingProps) {
  const isControlled = typeof rating === 'number';

  // only used in uncontrolled mode
  const [uncontrolledRating, setUncontrolledRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const currentRating = isControlled ? (rating ?? 0) : uncontrolledRating;

  function handleRate(value: number) {
    if (!isControlled) setUncontrolledRating(value);
    onSetRating?.(value);
  }

  const textStyle = { lineHeight: '1', margin: 0 as const };

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
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
