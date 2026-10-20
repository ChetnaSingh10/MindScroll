import React from 'react';

export const BackgroundGlow: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Single subtle accent glow positioned at the top center */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[60rem] h-[35rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle fine film grain texture using SVG filter */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
};
