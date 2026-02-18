import { useState } from 'react';
import fallbackPoster from '../../assets/no-poster.png';

type PosterProps = {
  src: string;
  alt: string;
  className?: string;
};

const FALLBACK_POSTER = fallbackPoster;

export default function Poster({ src, alt, className }: PosterProps) {
  const [imgSrc, setImgSrc] = useState(
    src === 'N/A' || !src ? FALLBACK_POSTER : src,
  );

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(FALLBACK_POSTER)}
    />
  );
}
