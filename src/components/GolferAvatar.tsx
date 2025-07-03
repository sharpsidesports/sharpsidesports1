import React from 'react';

interface GolferAvatarProps {
  name: string;
  dg_id?: string;
  className?: string;
  size?: number;
}

const GolferAvatar: React.FC<GolferAvatarProps> = ({ name, dg_id, className = '', size = 32 }) => {
  const [imgSrc, setImgSrc] = React.useState(
    dg_id
      ? `https://datagolf.com/images/players/${dg_id}.png`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}`
  );

  return (
    <img
      src={imgSrc}
      alt={name}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() =>
        setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}`)
      }
    />
  );
};

export default GolferAvatar; 