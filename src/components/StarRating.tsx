import { useState } from 'react';
import { Star } from 'lucide-react';

export type StarRatingProps = {
  maxRating?: number;

  /**
   * Optional controlled value. If provided, StarRating will display this rating
   * instead of its internal state.
   */
  rating?: number;

  /**
   * Optional initial value for uncontrolled usage.
   */
  defaultRating?: number;

  color?: string;
  size?: number | string;

  /**
   * Called whenever the user picks a rating.
   */
  onSetRating?: (rating: number) => void;
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const starContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const starStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  display: 'block',
  cursor: 'pointer',
};

type StarItemProps = {
  onRate: () => void;
  full: boolean;
  color: string;
  size: number | string;
  onHoverIn: () => void;
  onHoverOut: () => void;
};

const StarItem = ({
  onRate,
  full,
  color,
  size,
  onHoverIn,
  onHoverOut,
}: StarItemProps) => (
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

export default function StarRating({
  maxRating = 3,
  color = '#fcc419',
  size = 24,
  rating: controlledRating,
  defaultRating = 0,
  onSetRating,
}: StarRatingProps) {
  const [internalRating, setInternalRating] = useState<number>(defaultRating);
  const [tempRating, setTempRating] = useState<number>(0);

  const isControlled = typeof controlledRating === 'number';
  const rating = isControlled ? controlledRating : internalRating;

  const handleRating = (next: number) => {
    if (!isControlled) setInternalRating(next);
    onSetRating?.(next);
  };

  const textStyle: React.CSSProperties = {
    lineHeight: '1',
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <StarItem
            key={i}
            color={color}
            size={size}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
      <p style={{ ...textStyle, color }}>{tempRating || rating || ''}</p>
    </div>
  );
}
