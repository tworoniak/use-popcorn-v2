import { useState } from 'react';
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

  const canTry = isValidPoster(src);
  const finalSrc = !canTry || failed ? FALLBACK : (src as string);

  // console.log({ src, canTry, failed, finalSrc });

  return (
    <img
      key={src ?? 'no-src'}
      className={className}
      src={finalSrc}
      alt={alt}
      loading='lazy'
      decoding='async'
      onError={() => setFailed(true)}
      referrerPolicy='no-referrer'
    />
  );
}
