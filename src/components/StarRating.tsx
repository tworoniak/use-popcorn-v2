import { useState, type SetStateAction } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  maxRating?: number;
  rating?: number;
  color?: string;
  size?: number | string;
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
  // gap: '0.25rem',
};

const textStyle = {
  lineHeight: '1',
  margin: 0,
};

const starStyle = {
  width: '24px',
  height: '24px',
  display: 'block',
  cursor: 'pointer',
};

const StarItem = ({
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
}) => (
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

const StarRating = ({
  maxRating = 3,
  color = '#fcc419',
  size = 24,
}: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const handleRating = (rating: SetStateAction<number>) => {
    setRating(rating);
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
};

export default StarRating;

{
  /* <Star size={40} color="#fcc419" strokeWidth={1.5} /> */
}
