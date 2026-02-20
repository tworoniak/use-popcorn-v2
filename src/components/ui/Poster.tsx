import { useEffect, useState } from 'react';
import fallbackPoster from '../../assets/no-poster.png';

type PosterProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

const FALLBACK = fallbackPoster;

function isValidPoster(src?: string | null) {
  return !!src && src !== 'N/A';
}

export default function Poster({ src, alt, className }: PosterProps) {
  const [failed, setFailed] = useState(false);

  // Reset error state when src changes (deferred to avoid React 19 warning)
  useEffect(() => {
    if (!failed) return;

    const id = window.requestAnimationFrame(() => {
      setFailed(false);
    });

    return () => window.cancelAnimationFrame(id);
  }, [src, failed]);

  const finalSrc = failed || !isValidPoster(src) ? FALLBACK : (src as string);

  return (
    <img
      className={className}
      src={finalSrc}
      alt={alt}
      loading='lazy'
      onError={() => setFailed(true)}
    />
  );
}
