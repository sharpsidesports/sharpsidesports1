import React from 'react';

interface NflPlayerAvatarProps {
  name: string;
  espnId?: string | null;
  className?: string;
  size?: number;
}

// Mirrors src/components/GolferAvatar.tsx's pattern: ESPN's public headshot
// CDN keyed by the numeric ESPN athlete ID already present on every player
// this app pulls from ESPN's own projections API, with a generated-initials
// fallback for missing/broken images.
const NflPlayerAvatar: React.FC<NflPlayerAvatarProps> = ({ name, espnId, className = '', size = 40 }) => {
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=E6F4EA&color=3CB371`;
  const [imgSrc, setImgSrc] = React.useState(
    espnId ? `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png` : fallbackSrc
  );

  return (
    <img
      src={imgSrc}
      alt={name}
      className={`rounded-full object-cover bg-gray-100 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default NflPlayerAvatar;
